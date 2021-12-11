<template>
  <Info v-if="deleteMessage" :message="deleteMessage"></Info>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header">
      <h2 class="card-title fw-bolder">Events</h2>

      <div class="card-toolbar">
        <router-link
          :to="{
            name: 'add-event',
          }"
        >
          <button class="btn btn-flex btn-primary">
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            Add Event
          </button>
        </router-link>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body">
      <!--begin::Event Table-->
      <KtDatatable :table-data="tableData" :table-header="tableHeader">
        <template v-slot:cell-eventName="{ row: event }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ event.eventName }}
          </a>
        </template>
        <template v-slot:cell-eventDate="{ row: event }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ formatDate(event.eventDate) }}
          </a>
        </template>
        <template v-slot:cell-eventDescription="{ row: event }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            {{ event.eventDescription }}
          </a>
        </template>
        <template v-slot:cell-actions="{ row: event }">
          <router-link
            :to="{
              name: 'edit-event',
              params: { id: event.id },
            }"
            class="btn btn-sm btn-light btn-active-light-primary me-5"
            >Edit
          </router-link>
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_delete_event"
            @click="setDeletedEvent(event)"
            >Delete
          </a>
        </template>
      </KtDatatable>
      <!--end::Event Table-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->

  <NewDeleteModal></NewDeleteModal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import moment from "moment";
import KtDatatable from "@/components/kt-datatable/KTDatatable.vue";
import { events } from "@/core/mock/MockService";
import Info from "@/components/sections/Info.vue";
import NewDeleteModal from "@/components/modals/forms/DeleteEventModal.vue";
import { Actions } from "@/store/enums/StoreEnums";

export default defineComponent({
  name: "events-app-1",
  components: {
    NewDeleteModal,
    Info,
    KtDatatable,
  },
  data() {
    return {
      deleteMessage: null,
      eventForDeleting: {} as {
        eventDate: moment.Moment;
        eventName: string;
        eventDescription: string;
        id: string;
      },
    };
  },
  computed: {
    formatDate() {
      return (value) => `${moment(String(value)).format("DD/MM/YYYY")}`;
    },
  },
  methods: {
    setDeleteMessage(value) {
      this.deleteMessage = value;
    },
    setDeletedEvent(event) {
      this.eventForDeleting = event;
    },
  },
  setup() {
    const tableHeader = ref([
      {
        name: "Event Name",
        key: "eventName",
        sortingField: "eventName",
        sortable: true,
      },
      {
        name: "Event Date",
        key: "eventDate",
        sortingField: "eventDate",
        sortable: true,
      },
      {
        name: "Event Description",
        key: "eventDescription",
        sortable: true,
      },
      {
        name: "Actions",
        key: "actions",
      },
    ]);

    const tableData = ref<
      Array<{
        id: string;
        eventName: string;
        eventDate: moment.Moment;
        eventDescription: string;
      }>
    >(events);

    return {
      tableHeader,
      tableData,
    };
  },
  mounted() {
    const modal = document.getElementById("kt_modal_delete_event_confirm");
    if (modal) {
      // Listening for the confirm answer from the delete modal
      modal.addEventListener("click", () => {
        const event = this.eventForDeleting as {
          eventDate: moment.Moment;
          eventName: string;
          eventDescription: string;
          id: string;
        };

        // Deleting the selected event
        const index = this.tableData.map((e) => e.id).indexOf(event.id);
        if (index !== -1) {
          this.tableData.splice(index, 1);
          this.setDeleteMessage("Successfully deleted!");
          setTimeout(() => {
            this.setDeleteMessage(null);
          }, 2000);
        }
      });
    }
  },
});
</script>

<style lang="scss">
.fc .fc-button {
  padding: 0.75rem 1.25rem;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0.475rem;
  vertical-align: middle;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
