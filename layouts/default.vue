<script setup lang="ts">
useHead({
  titleTemplate: '%s | Project mTux',
})
</script>

<template>
  <QLayout view="hHh lpR fFf">
    <Header />

    <QPageContainer class="q-pa-xl">
      <slot />
    </QPageContainer>

    <Footer />
  </QLayout>
</template>
