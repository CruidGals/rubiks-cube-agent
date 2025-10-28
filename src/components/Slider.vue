<script setup lang="ts">
import { turnSpeed } from '../composables/cubeLogic';

</script>

<template>
    <div>
        <input 
            type="range" 
            min="0" 
            max="10" 
            v-model="turnSpeed"
            @mousedown="(e) => (e.currentTarget as HTMLInputElement).blur()"
        />
    </div>
</template>