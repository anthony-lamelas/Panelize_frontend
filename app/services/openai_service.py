import openai       
import os
import requests
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
from io import BytesIO
from PIL import Image
import re


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def sanitize_theme(theme: str) -> str:
    # Allow only letters, numbers, spaces, and dashes
    return re.sub(r"[^a-zA-Z0-9\- ]", "", theme).strip() or "manga"

def generate_panels(story_description: str, num_panels: int, theme: str):
    them = sanitize_theme(theme)

    # GPT Breakdown
    system_msg = (
        f"You are a prompt engineer for DALL·E. "
        f"Take the user's story and split it into multiple panel prompts, create the story in the theme provided. "
        f"Each panel describes a distinct scene in detail, in under 1000 characters each. Make sure to include 'In colored {them} theme generate the following:'" \
        f"in the beggining of each prompt. "
        f"Return them as a numbered list, for example:\n"
        f"Panel 1: This is the theme {them}. In color, generate the following: <prompt text>\n"
        f"Panel 2: This is the theme {them}. In color, generate the following: <prompt text>\n"
        f"..."
            )

    user_msg = f"Break this story into {num_panels} prompts:\n\n{story_description}"

    # print(f"[DEBUG] Theme received: '{them}' → sanitized: '{them}'")
    # print(f"[DEBUG] Sending to GPT:\nSystem: {system_msg[:500]}...\nUser: {user_msg[:500]}...\n")


    gpt_response = client.chat.completions.create(  
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]
    )

    # print("[DEBUG] GPT response received.")
    # print(f"[DEBUG] GPT response: {gpt_response}")

    content = gpt_response.choices[0].message.content
    if not content:
        raise ValueError("GPT returned empty content.")

    # Parse GPT output
    panel_prompts = parse_gpt_panels(content, num_panels)

    # DALLE generation
    results = []
    previous_caption = ""
    for i, panel_prompt in enumerate(panel_prompts):

        # For the first panel, use the original prompt
        if i == 0:
            used_prompt = panel_prompt
        else:
            # For subsequent panels, combine the previous caption + new prompt
            used_prompt = (
                "Generate this next image based on the following description "
                f"of the previous image as you are telling a story: {previous_caption}. {panel_prompt}"
            )

        print(f"[DEBUG] Generating image for prompt: '{used_prompt}'")
        image_response = client.images.generate(  # CHANGED FOR NEW OPENAI SYNTAX
            prompt=used_prompt,
            n=1,
            size="1024x1024",
            model="dall-e-3"  
        )

        print(f"[DEBUG] Image response: {image_response}")

        if not image_response.data:  # CHANGED FOR NEW OPENAI SYNTAX
            results.append({"prompt": used_prompt, "image_url": None, "caption": None})
            continue

        image_url = image_response.data[0].url  # CHANGED FOR NEW OPENAI SYNTAX

        # Caption using BLIP
        image_bytes = requests.get(image_url).content
        caption = caption_image(image_bytes)
        previous_caption = caption

        results.append({"prompt": used_prompt, "image_url": image_url, "caption": caption})

    return results

def parse_gpt_panels(gpt_content: str, num_panels: int):
    # Split GPT output lines into separatr prompts
    lines = gpt_content.strip().split("\n")
    panel_prompts = []
    current_prompt = []

    for line in lines:
        if "Panel" in line and ":" in line:
            # If we have an existing prompt, finalize it
            if current_prompt:
                panel_prompts.append("\n".join(current_prompt).strip())
                current_prompt = []

            # Start a new prompt
            current_prompt.append(line.split(":", 1)[1].strip())
        else:
            current_prompt.append(line.strip())

    # Last prompt
    if current_prompt:
        panel_prompts.append("\n".join(current_prompt).strip())

    return panel_prompts[:num_panels]

def caption_image(image_bytes: bytes) -> str:
    device = "cuda" if torch.cuda.is_available() else "cpu"

    # Load BLIP 
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base", use_fast=True)

    model = BlipForConditionalGeneration.from_pretrained(
        "Salesforce/blip-image-captioning-base",
        torch_dtype=torch.float32).to(device)
    model.eval() # evalutaion mode since we are not making predictions

    img = Image.open(BytesIO(image_bytes)).convert("RGB")

    # Preprocess & generate
    inputs = processor(img, return_tensors="pt").to(device)
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_length=300,
            num_beams=7,
            do_sample=True,
            top_k=100,
            top_p=0.95,
            temperature=1.2,
            early_stopping=False
        )

    # Decode the output tokens 
    caption = processor.decode(output_ids[0], skip_special_tokens=True)
    return caption
