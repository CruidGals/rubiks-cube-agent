<script setup lang="ts">
const model = defineModel<number>({ required: true });

defineProps<{
  minVal?: number;     // Optional number
  maxVal?: number;     // Optional number
}>();

</script>

<template>
    <div>
        <input 
            type="range" 
            :min="minVal ?? 0" 
            :max="maxVal ?? 10"
            v-model.number="model"
            @mousedown="(e) => (e.currentTarget as HTMLInputElement).blur()"
        />
    </div>
</template>