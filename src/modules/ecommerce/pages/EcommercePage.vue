<script setup lang="ts">
  import ProductComponent from './../../ecommerce/components/ProductComponent.vue';
  import InformationComponent from './../../ecommerce/components/InformationComponent.vue';
  import { ref } from 'vue'
  import ProgressBarComponent from '../components/ProgressBarComponent.vue';

  const icon_position = ref<string>('left')
  const items = [
          {
            title: 'Clientes',
            icon: 'person',
            value: '200',
            color1: '#5064b5',
            color2: '#3e51b5'
          },
          {
            title: 'Followers',
            icon: 'fab fa-twitter',
            value: '500',
            color1: '#f37169',
            color2: '#f34636'
          },
          {
            title: 'Cone',
            icon: 'fab fa-google',
            value: '50',
            color1: '#ea6a7f',
            color2: '#ea4b64'
          },
          {
            title: 'Visitas',
            icon: 'bar_chart',
            value: '1020',
            color1: '#a270b1',
            color2: '#9f52b1'
          }
        ]

</script>

<template>
  <q-page-container>

    <section style="min-height: 25vh;" class="flex text-white flex-center layout_bg">
      <div style="position: relative">
        <div class="text-h2 text-bold text-center" >
          Elige el mejor plan para ti !
        </div>
        <div class="text-subtitle1 q-pt-sm text-center q-mt-lg">
          Dispones de diferentes opciones y mayor probabilidad de ser un ganador según cada paquete.
        </div>
      </div>
    </section>
    <q-space />
    <section class="q-pb-lg">
      <div class="row q-col-gutter-sm q-px-sm">
        <ProgressBarComponent></ProgressBarComponent>
      </div>
    </section>
    <q-space />
    <section class="q-pb-lg">
      <div class="row q-col-gutter-sm q-px-sm">
        <ProductComponent></ProductComponent>
      </div>
    </section>

    <section class="q-pb-lg q-mt-xl">
        <InformationComponent></InformationComponent>
    </section>

    <section style="min-height: 25vh;" class="flex text-white flex-center layout_bg q-mt-lg">
      <q-card class="bg-transparent no-shadow no-border">
        <q-card-section class="q-pa-none">
          <div class="row q-col-gutter-sm ">
            <div v-for="(item, index) in items" :key="index" class="col-md-3 col-sm-12 col-xs-12">
              <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
                <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${item.color2}`"
                                class=" q-pa-lg q-mr-none text-white">
                  <q-icon :name="item.icon" color="white" size="24px"></q-icon>
                </q-item-section>
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
                  <q-item-label>{{ item.title }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
                  <q-icon :name="item.icon" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </section>

  </q-page-container>
</template>

<style lang="scss" scoped>
</style>
