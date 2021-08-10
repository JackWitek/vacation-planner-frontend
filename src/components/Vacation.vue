<template>
  <div class="justify-center">
    <h1
      class="text-purple font-normal leading-normal justify-center mt-1 mb-2 "
    >
      {{ this.vacation.name }}
    </h1>

    <ul class="list-reset space-x-4  ">
      <li class="w-64 inline-block " v-for="day in days" :key="day.id">
        <div>
          <form action="" v-on:change="updateVacation()">
            <div
              class="mb-6 ml-2 p-4 bg-white rounded border border-blue-light mt-4"
            >
              <h3 class="pb-1">{{ getNiceDate(day.date) }}</h3>

              <div class="mb-6">
                <label class="label">Location</label>
                <input class="input" v-model="day.location" />
              </div>

              <div class="mb-6">
                <label class="label">Activities</label>

                <textarea
                  class="form-textarea mt-1 block w-full"
                  rows="8"
                  v-model="day.activities"
                ></textarea>
              </div>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "vacationDisplay",
  props: ["vacation"],
  data() {
    return {
      days: []
    };
  },
  created() {
    if (!localStorage.signedIn) {
      this.$router.replace("/");
      console.log("Not signed in");
    } else {
      console.log("Signed in");
    }
  },
  mounted() {
    this.getDays(this.vacation.data);
    Vue.set();
  },
  methods: {
    getDays(data) {
      var json = JSON.parse(data);

      for (const item of json) {
        console.log(item);
        this.days.push(item);
      }
    },
    getNiceDate(date) {
      var dateFormat = require("dateformat");
      return dateFormat(date, "dddd, mmm dS");
    },
    updateVacation() {
      this.$http.secured
        .patch(`/api/v1/vacations/${this.vacation.id}`, {
          vacation: { data: JSON.stringify(this.days) }
        })
        .catch(error => this.setError(error, "Cannot update vacation"));
    }
  }
};
</script>

<style></style>
