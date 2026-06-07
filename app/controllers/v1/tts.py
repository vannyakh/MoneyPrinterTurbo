import os

from fastapi import Query, Request
from fastapi.responses import FileResponse
from loguru import logger

from app.controllers.v1.base import new_router
from app.models.exception import HttpException
from app.models.schema import (
    TtsServersResponse,
    TtsVoicesResponse,
    VoicePreviewRequest,
)
from app.services import voice
from app.utils import utils

router = new_router()


@router.get(
    "/tts/servers",
    response_model=TtsServersResponse,
    summary="List available TTS servers",
)
def list_tts_servers(request: Request):
    return utils.get_response(200, {"servers": voice.get_tts_server_options()})


@router.get(
    "/tts/voices",
    response_model=TtsVoicesResponse,
    summary="List speech synthesis voices for a TTS server",
)
def list_tts_voices(
    request: Request,
    tts_server: str = Query("azure-tts-v1", description="TTS server id"),
    locale: str = Query("", description="UI locale used to pick a default voice"),
    current_voice: str = Query("", description="Currently selected voice id"),
):
    voices = voice.get_voices_for_tts_server(tts_server)
    voice_items = [
        {"id": voice_id, "label": voice.format_voice_label(voice_id)}
        for voice_id in voices
    ]
    default_voice = voice.pick_default_voice_name(voices, locale, current_voice)
    return utils.get_response(
        200,
        {
            "voices": voice_items,
            "default_voice": default_voice,
        },
    )


@router.post("/tts/preview", summary="Preview a speech synthesis voice")
def preview_voice(request: Request, body: VoicePreviewRequest):
    request_id = utils.get_uuid()
    text = (body.text or "").strip() or "Voice Example"
    temp_dir = utils.storage_dir("temp", create=True)
    audio_file = os.path.join(temp_dir, f"tmp-voice-{request_id}.mp3")

    sub_maker = voice.tts(
        text=text,
        voice_name=body.voice_name,
        voice_rate=body.voice_rate or 1.0,
        voice_file=audio_file,
        voice_volume=body.voice_volume or 1.0,
    )

    if not sub_maker:
        fallback = (
            "This is a example voice. if you hear this, the voice synthesis failed "
            "with the original content."
        )
        sub_maker = voice.tts(
            text=fallback,
            voice_name=body.voice_name,
            voice_rate=body.voice_rate or 1.0,
            voice_file=audio_file,
            voice_volume=body.voice_volume or 1.0,
        )

    if not sub_maker or not os.path.exists(audio_file):
        logger.error(f"voice preview failed, request_id: {request_id}")
        raise HttpException(
            task_id=request_id,
            status_code=500,
            message=f"{request_id}: voice preview failed",
        )

    return FileResponse(
        path=audio_file,
        media_type="audio/mpeg",
        filename="voice-preview.mp3",
    )
