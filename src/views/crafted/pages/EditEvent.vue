<template>
  <NewEventModal
    :id="eventId"
    :action="actions.EDIT_EVENT"
    title="Edit Event"
  ></NewEventModal>
</template>

<script>
import { useRoute } from "vue-router";
import NewEventModal from "../../../components/modals/forms/NewEventModal";
import { Actions } from "../../../store/enums/StoreEnums";
import { onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "../../../core/helpers/breadcrumb";

export default {
  name: "EditEvent",
  components: { NewEventModal },
  data() {
    return {
      actions: Actions,
    };
  },
  setup() {
    const route = useRoute();
    const eventId = route.params.id;

    onMounted(() => {
      setCurrentPageBreadcrumbs("Edit Event", ["Events"]);
    });

    return {
      eventId,
    };
  },
};
</script>

<style scoped></style>
