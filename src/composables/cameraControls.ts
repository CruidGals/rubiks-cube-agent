import { ref } from "vue";
import { BaseCameraControls } from "@tresjs/cientos";

export function useCameraControls () {
    const hovering = ref(false);
    const blocking = ref(false);

    function onCameraControl() {
        if (blocking.value) return {left: BaseCameraControls.ACTION.NONE, right: BaseCameraControls.ACTION.NONE};
        return {left: BaseCameraControls.ACTION.ROTATE, right: BaseCameraControls.ACTION.TRUCK};
    }

    function onCubePointerDown(e: PointerEvent) {
        e.stopPropagation();
        blocking.value = true;

        const clear = () => {
            blocking.value = false;
            window.removeEventListener('pointerup', clear);
            window.removeEventListener('pointercancel', clear);
        };

        window.addEventListener('pointerup', clear, { once: true });
        window.addEventListener('pointercancel', clear, { once: true });
    }

    return { hovering, onCameraControl, onCubePointerDown };
}