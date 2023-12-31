<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useQuasar } from 'quasar'
  import ProductComponent from './../../ecommerce/components/ProductComponent.vue';
  import InformationComponent from './../../ecommerce/components/InformationComponent.vue';
  import ProgressBarComponent from '../components/ProgressBarComponent.vue';
  import { useEcommerceStore } from '../store/ecommerce-store';
  import { getEventActive } from '../composables/useEcommerceComposable';

  const $q = useQuasar()
  const showNoEvent = ref<boolean>(false)
  const ecommerceStore = useEcommerceStore()
  const icon_position = ref<string>('left')
  const theme_color = '#0d0d0d'
  const theme_colot_btn = '#0c3ef2'
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


  onMounted(() => {
    $q.loading.show({
      message: 'inactivando evento...'
    })
    getEventActive().then((response) => {
      ecommerceStore.activateEvent(response.data, response.data ? true : false)
      showNoEvent.value = response.data ? true : false
      console.log('SHOW', showNoEvent.value)
    }).catch(() => {notify('No se encuentra ningun evento activo', 'negative'), ecommerceStore.isActive(false)})
    .finally(() => $q.loading.hide())
  })

  function notify(msg: string, type: string) {
    $q.notify({
      message: msg,
      type: type,
      position: 'top',
      timeout: 5000
    })
  }

</script>

<template>
  <q-page-container style="padding-top: 0px;">
    <section class="flex flex-center">
      <div class="q-pa-md q-gutter-sm" v-if="!ecommerceStore.isActiveEvente">
        <q-card class="my-card2" flat bordered :style="'background:'+ theme_color +'; color: white'">
          <q-img src="../../../assets/muypronto.png" />
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h4 q-mt-md text-center">
                Muy pronto un nuevo evento estará disponible
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-h6 text-center">
              Recuerda estar atento, pronto podrás aquirir los planes
            </div>
          </q-card-section>

          <q-separator />
        </q-card>
      </div>
    </section>

    <section class="flex flex-center">
      <div v-if="ecommerceStore.isActiveEvente">
        <q-card class="my-card2" flat bordered :style="'background:'+ theme_color +'; color: white'">
          <q-img class="sizeImg" :src="ecommerceStore.activeEvent.img"  />
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h4 text-center text-bold color-black">
                {{ecommerceStore.activeEvent.name}}
              </div>
            </div>
            <q-separator />
            <br>
            <div class="text-caption text-center text-grey q-mt-10">
              <q-btn type="a" to="/sales" size="lg" icon="shopping_cart"
                    :style="'background:'+ theme_colot_btn +'; color: white'" label="COMPRAR AHORA"/>
            </div>
          </q-card-section>
          <q-separator />
        </q-card>
      </div>
    </section>

    <section class="q-pb-lg">
      <div class="row q-col-gutter-sm q-px-sm q-mt-md">
        <ProgressBarComponent></ProgressBarComponent>
      </div>
    </section>

    <!-- <section style="min-height: 25vh;" class="flex text-white flex-center layout_bg q-mt-sm">
      <div style="position: relative">
        <div class="text-h2 text-bold text-center" >
          Elige el mejor plan para ti !
        </div>
        <div class="text-subtitle1 q-pt-sm text-center q-mt-lg">
          Dispones de diferentes opciones y mayor probabilidad de ser un ganador según cada paquete.
        </div>
      </div>
    </section> -->
    <!-- <section style="min-height: 25vh;" class="flex text-white flex-center">
      <div>
        <q-banner :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" class="text-black">
          <template v-slot:avatar>
            <q-icon name="shopping_cart" color="primary" />
          </template>
          SI DESEAS ADQUIRIR MÁS DE UN PLAN DALE CLICK <q-icon name="south_east" color="primary" />
          <template v-slot:action>
            <q-btn  color="primary" to="/sales" label="COMPRAR VARIOS PLANES" />
          </template>
        </q-banner>
      </div>
    </section>
    <q-space /> -->
    <section class="q-pb-lg">
      <div class="row q-col-gutter-sm q-px-sm q-mt-lg">
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
  .my-card {
    width: 100%;
    max-width: auto;
  }
  @media (min-width: 640px){
    .my-card2 {
      width: 800px;
      max-width: auto;
    }
  }
  .sizeImg {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

</style>
