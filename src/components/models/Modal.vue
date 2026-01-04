<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });

function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
        isOpen.value = false;
    }
}

window.addEventListener('keydown', async (event) => {
    if (event.key === "Escape") isOpen.value = false;
});
</script>

<template>
    <div class="backdrop" v-if="isOpen" @click="handleBackdropClick">
        <slot></slot>
    </div>
</template>


<style scoped>
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255,255,255,0.1);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
</style>