<script lang="ts" setup></script>

<template>
  <QHeader
    elevated
    class="bg-primary text-white"
  >
    <QToolbar>
      <QToolbarTitle class="flex justify-start q-py-lg">
        <NuxtLink
          to="/"
          class="col-3 flex justify-center items-center q-gutter-lg text-white text-h5"
          style="text-decoration: none"
        >
          <QAvatar>
            <QImg
              src="/logo.png"
              ratio="1"
              width="40px"
              height="40px"
            />
          </QAvatar>
          <span>Project mTux</span>
        </NuxtLink>
      </QToolbarTitle>
    </QToolbar>
  </QHeader>
</template>

<!-- <template>
  <nav className='navbar bg-light mb-4 p-0'>
      <div className='container'>
        <a className='navbar-brand' href='/'>
          <div className='d-flex'>
            <img src={logo} alt='logo' className='mr-2' />
            <div>ProjectMgmt</div>
          </div>
        </a>
      </div>
    </nav>
</template> -->

<style scoped></style>
