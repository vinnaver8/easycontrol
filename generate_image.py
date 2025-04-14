import requests
import json
import time
import os

def generate_image(
    api_url: str,
    prompt: str,
    image_url: str,
    height: int,
    width: int,
    guidance_scale: float,
    lora_model: str,
    use_kv_cache: bool,
    num_inference_steps: int
) -> str:
    """Call EasyControl's Gradio API to generate an image."""
    payload = {
        "data": [
            prompt,
            {"path": image_url, "meta": {"_type": "gradio.FileData"}},
            height,
            width,
            guidance_scale,
            lora_model,
            use_kv_cache,
            num_inference_steps
        ]
    }

    headers = {"Content-Type": "application/json"}
    response = requests.post(
        f"{api_url}/gradio_api/call/single_condition_generate_image",
        headers=headers,
        data=json.dumps(payload)
    )

    if response.status_code != 200:
        raise Exception(f"API call failed: {response.text}")

    event_id = response.json().get("event_id")
    if not event_id:
        raise Exception("No event ID returned")

    while True:
        result_response = requests.get(
            f"{api_url}/gradio_api/call/single_condition_generate_image/{event_id}"
        )
        if result_response.status_code != 200:
            raise Exception(f"Polling failed: {result_response.text}")

        result = result_response.json()
        if result.get("complete"):
            output = result.get("data", [None])[0]
            if output and isinstance(output, dict) and "path" in output:
                return output["path"]
            raise Exception("No image path in response")
        time.sleep(1)

def save_image(image_url: str, output_path: str):
    """Download and save the generated image."""
    response = requests.get(image_url)
    if response.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"Image saved to {output_path}")
    else:
        raise Exception(f"Failed to download image: {response.text}")

def main():
    api_url = "https://jamesliu1217-easycontrol-ghibli.hf.space"
    prompt = "Hello!!"
    image_url = "https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png"
    height = 256
    width = 256
    guidance_scale = 3.0
    lora_model = "Ghibli"
    use_kv_cache = True
    num_inference_steps = 3

    try:
        image_path = generate_image(
            api_url, prompt, image_url, height, width,
            guidance_scale, lora_model, use_kv_cache, num_inference_steps
        )
        print(f"Generated image: {image_path}")
        save_image(image_path, "generated_image.png")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)

if __name__ == "__main__":
    main()
