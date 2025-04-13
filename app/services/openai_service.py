import openai       
import os
import requests
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
from io import BytesIO
from PIL import Image

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_panels(story_description: str, num_panels: int):

    # Part 1: GPT Breakdown
    system_msg = (
        "You are a prompt engineer for DALL·E. "
        "Take the user's story and split it into multiple panel prompts for a manga or comic, "
        "each describing a distinct scene in detail, under 1000 characters each. Make sure to include 'In colored manga theme generate the following:'" \
        "in the beggining of each prompt. "
        "Return them as a numbered list, for example:\n"
        "Panel 1: In colored manga theme generate the following: <prompt text>\n"
        "Panel 2: In colored manga theme generate the following: <prompt text>\n"
        "..."
            )

    user_msg = f"Break this story into {num_panels} prompts:\n\n{story_description}"

    gpt_response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]
    )

    content = gpt_response.choices[0].message.content
    if not content:
        raise ValueError("GPT returned empty content.")

    # Step 2: Parse GPT output
    panel_prompts = parse_gpt_panels(content, num_panels)

    # Step 3: DALLE generation
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
    
        # For each prompt, call DALLE
        image_response = openai.Image.create(
            prompt=used_prompt,
            n=1,
            size="1024x1024",
            model="dall-e-3"  
        )

        if not image_response["data"]:
            results.append({"prompt": used_prompt, "image_url": None, "caption": None})
            continue

        # Extract image URL
        image_url = image_response["data"][0]["url"]

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

    # Load BLIP model & processor
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    model.to(device)

    # Convert bytes to PIL Image
    img = Image.open(BytesIO(image_bytes)).convert("RGB")

    # Preprocess & generate
    inputs = processor(img, return_tensors="pt").to(device)
    with torch.no_grad():
        output_ids =model.generate(
        **inputs,
        max_length=300,      # longer generation
        num_beams=7,         # better quality
        do_sample=True,      # randomness for richness
        top_k=100,            # randomness control
        top_p=0.95,          # nucleus sampling for variety
        temperature=1.2,     # higher temperature for creativity
        early_stopping=False # full length generation
)

    # Decode the output tokens to text
    caption = processor.decode(output_ids[0], skip_special_tokens=True)
    return caption