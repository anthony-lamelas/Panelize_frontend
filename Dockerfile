# backend/Dockerfile
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copy source code
COPY . .

# Expose Flask port
EXPOSE 5000

# Run the Flask app
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "wsgi:app"]