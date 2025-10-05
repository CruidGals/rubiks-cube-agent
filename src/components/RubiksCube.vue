<script setup lang="ts">
import { onMounted, nextTick, markRaw } from 'vue';
import { useTres } from '@tresjs/core';
import { useCameraControls } from '../composables/cameraControls';
import { cubes, useRubiksCube } from '../composables/cubeVisual';
import { CubeFace, useCubeLogic } from '../composables/cubeLogic';

const { hovering, onCubePointerDown } = useCameraControls();
const { mats, setCubeObject } = useRubiksCube();
const { masterGroup, rotateFace } = useCubeLogic();

const { scene } = useTres();

onMounted(async () => {
  await nextTick(); // ensure meshes are in the scene & have parents
  // now it's safe:
  rotateFace(scene.value, CubeFace.R, true);
  
});

</script>

<template>
    <TresScene>
        <TresGroup ref="masterGroup">
            <TresMesh v-for="cube in cubes" 
                :key="cube.id" 
                :position="cube.position" 
                :material="mats" 
                :ref="(el) => setCubeObject(cube.id, markRaw(el))"
                @pointerenter="hovering = true" 
                @pointerleave="hovering = false" 
                @pointerdown="onCubePointerDown"
            >
                <TresBoxGeometry :args="[1, 1, 1]" />
            </TresMesh>
        </TresGroup>

        <!-- Lights -->
        <TresAmbientLight :intensity="1.0" />
        <TresPointLight :position="[10,-10,10]" />
    </TresScene>
</template>