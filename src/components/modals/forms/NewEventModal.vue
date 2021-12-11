<template>
  <div class="card">
    <!--begin::Form-->
    <el-form
      class="form fv-plugins-bootstrap5 fv-plugins-framework"
      id="kt_modal_add_event_form"
      @submit.prevent="submit()"
      :model="targetData"
      :rules="rules"
      ref="formRef"
    >
      <!--begin::Card header-->
      <div class="card-header align-items-center justify-content-center">
        <h2 class="fw-bolder">{{ title }}</h2>
      </div>
      <!--end::Card header-->
      <!--begin::Card body-->
      <div class="card-body py-10 px-lg-17">
        <!--begin::Input group-->
        <div class="fv-row mb-9 fv-plugins-icon-container">
          <!--begin::Label-->
          <label class="fs-6 fw-bold required mb-2">Event Name</label>
          <!--end::Label-->
          <!--begin::Input-->
          <el-form-item prop="eventName">
            <el-input
              v-model="targetData.eventName"
              type="text"
              name="eventName"
            />
          </el-form-item>
          <!--end::Input-->
          <div class="fv-plugins-message-container invalid-feedback"></div>
        </div>
        <!--end::Input group-->
        <!--begin::Input group-->
        <div class="row row-cols-lg-2 g-10">
          <div class="col">
            <div
              class="
                fv-row
                mb-9
                fv-plugins-icon-container fv-plugins-bootstrap5-row-valid
              "
            >
              <!--begin::Label-->
              <label class="fs-6 fw-bold mb-2 required">Event Date</label>
              <!--end::Label-->
              <!--begin::Input-->
              <el-date-picker
                v-model="targetData.eventDate"
                type="text"
                name="eventStartDate"
              />
              <!--end::Input-->
              <div class="fv-plugins-message-container invalid-feedback"></div>
            </div>
          </div>
        </div>
        <!--end::Input group-->
        <!--begin::Input group-->
        <div class="fv-row mb-9">
          <!--begin::Label-->
          <label class="fs-6 fw-bold mb-2">Event Description</label>
          <!--end::Label-->
          <!--begin::Input-->
          <el-input
            v-model="targetData.eventDescription"
            type="text"
            placeholder=""
            name="eventDescription"
          />
          <!--end::Input-->
        </div>
        <!--end::Input group-->
      </div>
      <!--end::Card body-->
      <!--begin::Card footer-->
      <div class="card-footer float-end">
        <!--begin::Button-->
        <button
          :data-kt-indicator="loading ? 'on' : null"
          ref="submitButton"
          class="btn btn-lg btn-primary"
          type="submit"
        >
          <span v-if="!loading" class="indicator-label">
            Submit
            <span class="svg-icon svg-icon-3 ms-2 me-0">
              <inline-svg src="icons/duotune/arrows/arr064.svg" />
            </span>
          </span>
          <span v-if="loading" class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Button-->
      </div>
      <!--end::Card footer-->
      <div></div>
    </el-form>
    <!--end::Form-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from "moment";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { events } from "@/core/mock/MockService";

interface NewAddressData {
  eventName: string;
  eventDate: moment.Moment;
  eventDescription: string;
  id?: string;
}

export default defineComponent({
  name: "new-event-modal",
  components: {},
  props: ["id", "action", "title"],
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const formRef = ref<null | HTMLFormElement>(null);
    const loading = ref<boolean>(false);

    let targetData;
    if (props.id) {
      const found = events.find((event) => {
        return props.id === event.id;
      });
      targetData = !found
        ? ref<NewAddressData>({
            eventName: "",
            eventDate: moment(),
            eventDescription: "",
          })
        : ref<NewAddressData>({
            id: found.id,
            eventName: found.eventName,
            eventDate: found.eventDate,
            eventDescription: found.eventDescription,
          });
    } else {
      targetData = ref<NewAddressData>({
        eventName: "",
        eventDate: moment(),
        eventDescription: "",
      });
    }

    const rules = ref({
      eventName: [
        {
          required: true,
          message: "Please input event name",
          trigger: "blur",
        },
      ],
      eventDate: [
        {
          required: true,
          message: "Please input event date",
          trigger: "blur",
        },
      ],
    });

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid) => {
        // Check if the form is valid
        if (valid) {
          loading.value = true;

          setTimeout(() => {
            // Add or Edit Event depending on the action type send from the view child
            store
              .dispatch(props.action, targetData.value)
              .then(() => {
                loading.value = false;

                // Display successful popup if the add or edit action is completed
                Swal.fire({
                  text: "Form has been successfully submitted!",
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                }).then(() => {
                  // Go back to the event page after successfully form submit
                  router.push({ name: "events" });
                });
              })
              .catch(() => {
                // Display error popup if the add or edit action is not completed
                Swal.fire({
                  text: store.getters.getEventErrors[0],
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Try again!",
                  customClass: {
                    confirmButton: "btn fw-bold btn-light-danger",
                  },
                });
              });
          }, 2000);
        } else {
          // Display error popup if the form is not valid
          Swal.fire({
            text: "Sorry, looks like there are some errors detected, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return false;
        }
      });
    };

    return {
      formRef,
      loading,
      targetData,
      rules,
      submit,
    };
  },
});
</script>

<style lang="scss">
.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
