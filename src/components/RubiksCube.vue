<script setup lang="ts">
import { useTres } from '@tresjs/core';
import { useCameraControls } from '../composables/cameraControls';
import { useRubiksCube } from '../composables/cubeVisual';
import { CubeFace, useCubeLogic } from '../composables/cubeLogic';

const { hovering, onCubePointerDown } = useCameraControls();
const { cubes, mats } = useRubiksCube();
const { masterGroup, rotateFace } = useCubeLogic();

</script>

<template>
    <TresGroup ref="masterGroup">
        <TresMesh v-for="cube in cubes" :key="cube.id" :position="cube.position" :material="mats" @pointerenter="hovering = true" @pointerleave="hovering = false" @pointerdown="onCubePointerDown">
            <TresBoxGeometry :args="[1, 1, 1]" />
        </TresMesh>
    </TresGroup>
</template>