<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { QTableProps, useQuasar } from 'quasar'
  import { PlansInterface } from '../interfaces';
  import { getAllPlans, createPlan, updatePlan, anactivePlan, inActivePlan } from '../composables';


  const $q = useQuasar()
  const filter = ''
  const planCreate = ref<boolean>(false)
  const planEdit = ref<boolean>(false)
  const planDelete = ref<boolean>(false)
  const planActive = ref<boolean>(false)
  const planName = ref<string>('')
  const planList = ref<PlansInterface[]>([])
  const planForm = ref({
    id: <string | null> null,
    name: <string | null> null,
    quantity_number: <number | null> null,
    price: <number | null> null,
    active: <boolean | null> null,
  })
  const columns: QTableProps['columns'] = [
    {
      name: 'name',
      required: true,
      label: 'Plan',
      align: 'left',
      sortable: true,
      field: 'name'
    },
    {
      name: 'quantity_number',
      required: true,
      label: 'Çantidad de números',
      align: 'left',
      sortable: true,
      field: 'quantity_number'
    },
    {
      name: 'price',
      required: true,
      label: 'Precio del Plan',
      align: 'left',
      sortable: true,
      field: 'price'
    },
    {
      name: 'active',
      required: true,
      label: 'Estado',
      align: 'left',
      sortable: true,
      field: 'active'
    },
    {
      name: 'action',
      align: 'left',
      label: 'Acciones',
      field: ''
    }
  ]

  onMounted(() => {
    gellAllEvent()
  })

  function gellAllEvent(): void {
    $q.loading.show({
      message: 'Cargando plan'
    })
    getAllPlans().then((response) => {
      planList.value = response.data
      $q.loading.hide()
    }).catch(() => {
      notify('Error al carga los planes', 'negative')
      $q.loading.hide()
    })
  }

  function addPlan(): void {
    planCreate.value = true
    onReset()
  }

  function onPlanSave(): void {
    $q.loading.show({
      message: 'Creando plan...'
    })
    planForm.value.active = true
    createPlan(planForm.value as PlansInterface).then((response) => {
      response.data
      notify('Plan creado con exito!', 'positive')
      gellAllEvent()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())

  }

  function editPlan(data: PlansInterface) {
    planEdit.value = true
    planForm.value = {
      id: data.id as string,
      name: data.name,
      quantity_number: data.quantity_number,
      price: data.price,
      active: data.active ? true : false
    }
  }

  function onUpdate(): void {
    $q.loading.show({
      message: 'Actualizando evento...'
    })
    updatePlan(planForm.value.id as string, planForm.value as PlansInterface).then((response) => {
      const data = response.data
      notify(`El plan ${data.name} actualizado con exito!`, 'positive')
      gellAllEvent()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function deletePlan(data: PlansInterface): void {
    planDelete.value = true
    planName.value = data.name
    planForm.value = {
      id: data.id as string,
      name: data.name,
      quantity_number: data.quantity_number,
      price: data.price,
      active: false
    }
  }

  function onDelete(): void {
    $q.loading.show({
      message: 'inactivando plan...'
    })
    anactivePlan(planForm.value.id as string, planForm.value as PlansInterface).then((response) => {
      const data = response.data
      notify(`El plan ${data.name} inactivado con exito!`, 'positive')
      $q.loading.hide()
      gellAllEvent()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
    })
  }

  function activePlan(data: PlansInterface): void {
    planActive.value = true
    planName.value = data.name
    planForm.value = {
      id: data.id as string,
      name: data.name,
      quantity_number: data.quantity_number,
      price: data.price,
      active: true
    }
  }

  function onActive(): void {
    $q.loading.show({
      message: 'Activando plan...'
    })
    inActivePlan(planForm.value.id as string, planForm.value as PlansInterface).then((response) => {
      const data = response.data
      notify(`El plan ${data.name} activado con exito!`, 'positive')
      $q.loading.hide()
      gellAllEvent()
    }).catch((err) => {
      notify( err.message ? err.message :'Revisar que la información este completa', 'negative')
      $q.loading.hide()
    })
  }

  function notify(msg: string, type: string) {
    $q.notify({
      message: msg,
      type: type,
      position: 'top',
      timeout: 5000
    })
  }

  function onReset() {
    planForm.value = {
      id: null,
      name: null,
      quantity_number: null,
      price: null,
      active: true
    }
  }
</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="planList"
      :columns="columns"
      row-key="name"
      :filter="filter"
    >
      <template #body-cell-action="props">
        <q-td top-center>
          <q-btn
            dense
            flat
            round
            color="blue"
            field="edit"
            icon="edit"
            @click="editPlan(props.row)"
          ></q-btn>
          <q-btn
            :disable="!props.row.active"
            dense
            flat
            round
            icon="delete"
            color="red"
            @click="deletePlan(props.row)"
          ></q-btn>
          <q-btn
            :disable="props.row.active"
            dense
            flat
            round
            icon="check_box"
            color="green"
            @click="activePlan(props.row)"
          ></q-btn>
        </q-td>
      </template>

      <template #body-cell-active="props">
        <q-td top-center>
          <q-checkbox
            v-model="props.row.active"
            center-label
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            color="green"
            disable
          />
        </q-td>
      </template>

      <template v-slot:top>
        <q-btn
          color="primary"
          label="Agregar plan"
          @click="addPlan()"
        ></q-btn>
        <q-space></q-space>
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </template>
    </q-table>
  </div>

  <div class="q-gutter-sm">
    <q-dialog v-model="planCreate" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">Crear Plan</div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12 col-sm-12">
              <q-input
                v-model="planForm.name"
                rounded
                outlined
                label="Plan"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombre']"
              />
              <q-input
                v-model="planForm.quantity_number"
                rounded
                mask="#"
                reverse-fill-mask
                outlined
                label="Çantidad de números"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar cantidad de numeros']"
              />
              <q-input
                v-model="planForm.price"
                rounded
                mask="#"
                reverse-fill-mask
                outlined
                label="Precio plan"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el precio del plan']"
              />
              <q-checkbox
                v-model="planForm.active"
                label="Activo"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                color="green"
                disable
              />
            </div>
            <div class="col-12 text-right q-gutter-sm">
              <q-btn
                label="Cancelar"
                outline
                rounded
                color="deep-orange"
                v-close-popup
              >
              </q-btn>
              <q-btn
                label="Guardar"
                outline
                rounded
                color="primary"
                @click="onPlanSave()"
                v-close-popup
              >
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="planEdit" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">
            Editar Plan
          </div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="planForm.name"
                rounded
                outlined
                label="Pan"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombre']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="planForm.quantity_number"
                rounded
                mask="#"
                reverse-fill-mask
                outlined
                label="Çantidad de números"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar cantidad de numeros']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="planForm.price"
                rounded
                mask="#"
                reverse-fill-mask
                outlined
                label="Precio plan"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el precio del plan']"
              />
            </div>
            <div class="col-12 text-right q-gutter-sm">
              <q-btn
                label="Cancelar"
                outline
                rounded
                color="deep-orange"
                v-close-popup
              >
              </q-btn>
              <q-btn
                label="Actualizar"
                outline
                rounded
                color="primary"
                @click="onUpdate()"
                v-close-popup
              >
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="planDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-sm">Desea inactivar el plan: <strong> {{ planName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Eliminar" @click="onDelete()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="planActive" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm">Desea activar el plan: <strong> {{ planName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Activar" @click="onActive()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped>

</style>
