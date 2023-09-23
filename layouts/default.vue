<template>
  <QLayout view="hHh lpR fFf">
    <Header />

    <QPageContainer class="q-pa-xl">
      <slot />
    </QPageContainer>

    <Footer />
  </QLayout>
</template>
