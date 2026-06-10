#!/usr/bin/env python3
"""List API keys from Pagar.me Core API v5."""

from __future__ import annotations

import base64
import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any


BASE_URL = "https://api.pagar.me/core/v5"
API_KEYS_ENDPOINT = f"{BASE_URL}/api_keys"


def build_authorization_header(secret_key: str) -> str:
    credentials = base64.b64encode(f"{secret_key}:".encode("utf-8")).decode("ascii")
    return f"Basic {credentials}"


def extract_api_keys(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]

    if not isinstance(payload, dict):
        return []

    for field in ("data", "items", "api_keys"):
        value = payload.get(field)
        if isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]

    return []


def display_value(api_key: dict[str, Any], *fields: str) -> str:
    for field in fields:
        value = api_key.get(field)
        if value is not None and value != "":
            return str(value)
    return "-"


def print_api_keys(api_keys: list[dict[str, Any]]) -> None:
    if not api_keys:
        print("Nenhuma chave de API encontrada.")
        return

    for index, api_key in enumerate(api_keys, start=1):
        print(f"Chave {index}")
        print(f"  ID: {display_value(api_key, 'id')}")
        print(f"  Nome: {display_value(api_key, 'name', 'label')}")
        print(
            "  Tipo de acesso: "
            f"{display_value(api_key, 'access_type', 'type', 'role', 'permissions')}"
        )
        print(
            "  Data de criacao: "
            f"{display_value(api_key, 'created_at', 'createdAt', 'date_created')}"
        )
        print()


def decode_error_body(error: urllib.error.HTTPError) -> str:
    try:
        body = error.read().decode("utf-8")
        payload = json.loads(body)
        if isinstance(payload, dict):
            return str(payload.get("message") or payload.get("error") or body)
        return body
    except (UnicodeDecodeError, json.JSONDecodeError):
        return "Resposta de erro sem detalhes."


def list_api_keys(secret_key: str) -> list[dict[str, Any]]:
    request = urllib.request.Request(
        API_KEYS_ENDPOINT,
        method="GET",
        headers={
            "Authorization": build_authorization_header(secret_key),
            "Accept": "application/json",
            "User-Agent": "pagarme-api-key-list/1.0",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as error:
        details = decode_error_body(error)
        if error.code == 401:
            raise RuntimeError(
                "Erro 401: autenticacao recusada. Verifique a PAGARME_SK."
            ) from error
        if error.code == 403:
            raise RuntimeError(
                "Erro 403: a chave autenticada nao possui permissao para listar chaves."
            ) from error
        raise RuntimeError(f"Erro HTTP {error.code}: {details}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(f"Falha de conexao com a API Pagar.me: {error.reason}") from error
    except json.JSONDecodeError as error:
        raise RuntimeError("A API retornou uma resposta JSON invalida.") from error

    return extract_api_keys(payload)


def main() -> int:
    secret_key = os.environ.get("PAGARME_SK", "").strip()
    if not secret_key:
        print(
            "Erro: defina a variavel de ambiente PAGARME_SK antes de executar.",
            file=sys.stderr,
        )
        return 2

    try:
        print_api_keys(list_api_keys(secret_key))
        return 0
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
