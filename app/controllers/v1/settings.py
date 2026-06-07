from fastapi import Request

from app.config import config
from app.controllers.v1.base import new_router
from app.models.exception import HttpException
from app.models.schema import VideoSettingsResponse, VideoSettingsUpdateRequest
from app.services import video as video_service
from app.utils import utils

router = new_router()

_VALID_VIDEO_SOURCES = {
    "pexels",
    "pixabay",
    "local",
    "douyin",
    "bilibili",
    "xiaohongshu",
}


def _read_video_settings() -> dict:
    video_source = str(config.app.get("video_source", "pexels") or "pexels").strip()
    if video_source not in _VALID_VIDEO_SOURCES:
        video_source = "pexels"

    return {
        "video_codec": video_service.normalize_configured_video_codec(
            config.app.get("video_codec")
        ),
        "video_source": video_source,
        "codec_options": video_service.get_video_codec_options(),
    }


@router.get(
    "/settings/video",
    response_model=VideoSettingsResponse,
    summary="Get persisted video settings from server config",
)
def get_video_settings(request: Request):
    return utils.get_response(200, _read_video_settings())


@router.put(
    "/settings/video",
    response_model=VideoSettingsResponse,
    summary="Update persisted video settings in server config",
)
def update_video_settings(request: Request, body: VideoSettingsUpdateRequest):
    request_id = utils.get_uuid()
    changed = False

    if body.video_codec is not None:
        codec = video_service.normalize_configured_video_codec(body.video_codec)
        config.app["video_codec"] = codec
        changed = True

    if body.video_source is not None:
        source = body.video_source.strip()
        if source not in _VALID_VIDEO_SOURCES:
            raise HttpException(
                task_id=request_id,
                status_code=400,
                message=f"{request_id}: invalid video_source",
            )
        config.app["video_source"] = source
        changed = True

    if changed:
        config.save_config()

    return utils.get_response(200, _read_video_settings())
