def __getattr__(attr):
    import requests

    return getattr(requests, attr)