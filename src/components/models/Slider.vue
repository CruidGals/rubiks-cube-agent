<script setup lang="ts">

const model = defineModel<number>({ required: true });

const props = defineProps<{
  minVal?: number;     // Optional number
  maxVal?: number;     // Optional number
  onMouseDown?: () => void; // Optional function
}>();

</script>

<template>
    <div>
        <input 
            type="range" 
            :min="minVal ?? 0" 
            :max="maxVal ?? 10"
            v-model.number="model"
            @mousedown="(e) => {(e.currentTarget as HTMLInputElement).blur(); onMouseDown?.(); }"
        />
    </div>
</template>