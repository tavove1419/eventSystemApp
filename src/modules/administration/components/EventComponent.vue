<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { QTableProps, useQuasar } from 'quasar'
  import { EventInterface } from '../interfaces';
  import { createEvent, getAllEvent, updateEvent, anactiveEvent, inActiveEvent } from '../composables';


  const $q = useQuasar()
  const filter = ''
  const eventCreate = ref<boolean>(false)
  const eventEdit = ref<boolean>(false)
  const eventDelete = ref<boolean>(false)
  const eventActive = ref<boolean>(false)
  const eventName = ref<string>('')
  const eventList = ref<EventInterface[]>([])
  const disabledBtn = ref<boolean>(true)
  let rawImg
  const image = ref()
  const eventForm = ref({
    id: <string | null> null,
    name: <string | null> null,
    description: <string | null> null,
    img: <string | null> null,
    status: <boolean | null> null
  })
  const columns: QTableProps['columns'] = [
    {
      name: 'name',
      required: true,
      label: 'Evento',
      align: 'left',
      sortable: true,
      field: 'name'
    },
    {
      name: 'img',
      required: true,
      label: 'Imagen evento',
      align: 'left',
      sortable: true,
      field: 'img'
    },
    {
      name: 'status',
      required: true,
      label: 'Estado',
      align: 'left',
      sortable: true,
      field: 'status'
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
      message: 'Cargando eventos'
    })
    getAllEvent().then((response) => {
      eventList.value = response.data
      $q.loading.hide()
    }).catch(() => {
      notify('Error al carga los eventos', 'negative')
      $q.loading.hide()
    })
  }

  function addEvent(): void {
    eventCreate.value = true
    onReset()
  }

  function onEventSave() {
    $q.loading.show({
      message: 'Creando evento...'
    })
    eventForm.value.status = false
    createEvent(eventForm.value as EventInterface).then((response) => {
      response.data
      notify('Evento creado con exito!', 'positive')
      gellAllEvent()
    }).catch(() => {
      notify('Revisar que la información este completa o ningun evento este activo', 'negative')
    }).finally(() => $q.loading.hide())

  }

  function imageB64(img: File): void {
    $q.loading.show({
      message: 'Cargando imagen espere por favor...',
    })
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        rawImg = reader.result
        eventForm.value.img = rawImg as string
        disabledBtn.value = false
        $q.loading.hide()
      }
      reader.readAsDataURL(img)
    } catch (error) {
      disabledBtn.value = true
      $q.loading.hide()
    }

  }

  function editEvent(data: EventInterface) {
    eventEdit.value = true
    data.img ? disabledBtn.value = false : disabledBtn.value = true
    eventForm.value = {
      id: data.id as string,
      name: data.name,
      description: data.description,
      img: data?.img ? data?.img as string : '',
      status: data.status ? true : false
    }
  }

  function onUpdate(): void {
    $q.loading.show({
      message: 'Actualizando evento...'
    })
    updateEvent(eventForm.value.id as string, eventForm.value as EventInterface).then((response) => {
      const data = response.data
      notify(`El Evento ${data.name} actualizado con exito!`, 'positive')
      $q.loading.hide()
      gellAllEvent()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
    })
  }

  function deleteEvent(data: EventInterface): void {
    eventDelete.value = true
    eventName.value = data.name
    eventForm.value = {
      id: data.id as string,
      name: data.name,
      description: data.description,
      img: data?.img ? data?.img as string : '',
      status: false
    }
  }

  function activeEvent(data: EventInterface): void {
    eventActive.value = true
    eventName.value = data.name
    eventForm.value = {
      id: data.id as string,
      name: data.name,
      description: data.description,
      img: data?.img ? data?.img as string : '',
      status: true
    }
  }

  function onDelete(): void {
    $q.loading.show({
      message: 'inactivando evento...'
    })
    anactiveEvent(eventForm.value.id as string, eventForm.value as EventInterface).then((response) => {
      const data = response.data
      notify(`El Evento ${data.name} inactivado y/o finalizado con exito!`, 'positive')
      $q.loading.hide()
      gellAllEvent()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
      $q.loading.hide()
    })
  }

  function onActive(): void {
    $q.loading.show({
      message: 'Activando evento...'
    })
    inActiveEvent(eventForm.value.id as string, eventForm.value as EventInterface).then((response) => {
      const data = response.data
      notify(`El Evento ${data.name} activado con exito!`, 'positive')
      $q.loading.hide()
      gellAllEvent()
    }).catch((err) => {
      notify( err.message ? err.message : 'Revisar que la información este completa', 'negative')
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
    eventForm.value = {
      id: null,
      name: null,
      description: null,
      img: null,
      status: true
    }
  }

</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="eventList"
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
            @click="editEvent(props.row)"
          ></q-btn>
          <q-btn
            :disable="!props.row.status"
            dense
            flat
            round
            icon="delete"
            color="red"
            @click="deleteEvent(props.row)"
          ></q-btn>
          <q-btn
            :disable="props.row.status"
            dense
            flat
            round
            icon="check_box"
            color="green"
            @click="activeEvent(props.row)"
          ></q-btn>
        </q-td>
      </template>

     <template #body-cell-img="props">
        <q-td top-center style="height: 100px;">
          <img class="sizeImg" v-bind:src="props.row.img" />
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td top-center>
          <q-checkbox
            v-model="props.row.status"
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
          label="Agregar Evento"
          @click="addEvent()"
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
    <q-dialog v-model="eventCreate" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">Crear Evento</div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12 col-sm-12">
              <q-input
                v-model="eventForm.name"
                rounded
                outlined
                label="Evento"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombre']"
              />
              <q-input
                v-model="eventForm.description"
                rounded
                outlined
                type="textarea"
                label="Descripción"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar descripcion']"
              />
              <q-file
                v-model="image"
                label="Imagen evento"
                flat
                clearable
                accept=".jpeg,.jpg,.png"
                max-file-size="5120000"
                max-files="1"
                @update:model-value="() => imageB64(image)"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <q-checkbox
                v-model="eventForm.status"
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
                :disable="disabledBtn"
                color="primary"
                @click="onEventSave()"
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
    <q-dialog v-model="eventEdit" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">
            Editar Evento
          </div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="eventForm.name"
                rounded
                outlined
                label="Evento"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar evento']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="eventForm.description"
                rounded
                outlined
                type="textarea"
                label="Descripción evento"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar descripción']"
              />
            </div>
            <div class="col-12">
              <q-file
                v-model="image"
                label="Imagen evento"
                flat
                clearable
                accept=".jpeg,.jpg,.png"
                max-file-size="5120000"
                max-files="1"
                @update:model-value="() => imageB64(image)"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
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
                :disable="disabledBtn"
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
    <q-dialog v-model="eventDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-sm">Desea inactivar o finalizar el evento: <strong> {{ eventName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Eliminar" @click="onDelete()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="eventActive" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm">Desea activar el evento: <strong> {{ eventName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Activar" @click="onActive()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped lang="scss">
  .sizeImg {
    width: 50%;
    height: 100%;
    object-fit: fill;
  }
</style>
