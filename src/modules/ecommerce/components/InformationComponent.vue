<script setup lang="ts">
  import { ref } from 'vue'

  const slide = ref<number>(1)
</script>

<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-carousel animated v-model="slide" infinite height="400px" arrows transition-prev="slide-right"
                transition-next="slide-left">
      <q-carousel-slide :name="1" class="q-pa-none">
        <q-scroll-area class="fit">
          <q-card class="my-card">
            <q-img src="../../../assets/moto.jpg">
              <!-- <div class="absolute-bottom text-subtitle1 text-center">
                <q-btn type="a" href="https://github.com/sponsors/mayank091193" size="lg"
                     :style="'background:'+ theme_color +'; color: white'" label="Support Me"/>
              </div> -->
            </q-img>
            <!-- <img src="../../../assets/moto.jpg"/> -->

          </q-card>
        </q-scroll-area>
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="q-pa-none">
        <q-scroll-area class="fit">
          <q-card class="my-card">
            <img src="../../../assets/pc.png"/>
          </q-card>
        </q-scroll-area>
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="q-pa-none">
        <q-scroll-area class="fit">
          <q-card class="my-card">
            <img src="../../../assets/dinero.png"/>
          </q-card>
        </q-scroll-area>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>


<style scoped>
  .my-card{
    width: 100%;
    height: 30%;
  }
</style>
