import base64



def get_base64_encode_string(email,password):
    credentials = f"{email}:{password}"
    encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
    return encoded_credentials