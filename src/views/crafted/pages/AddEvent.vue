<template>
  <NewEventModal :action="actions.ADD_NEW_EVENT" title="Add a New Event"></NewEventModal>
</template>

<script>
import NewEventModal from "../../../components/modals/forms/NewEventModal";
import { Actions } from "../../../store/enums/StoreEnums";
import { onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "../../../core/helpers/breadcrumb";

export default {
  name: "AddEvent",
  components: { NewEventModal },
  data() {
    return {
      actions: Actions,
    };
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("Add Event", ["Events"]);
    });
  },
};
</script>

<style scoped></style>
