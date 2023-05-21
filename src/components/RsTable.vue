<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Nama RS</th>
          <th>Jarak (KM)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rs in rsList" :key="rs.nama">
          <td>{{ rs.nama }}</td>
          <td>{{ rs.jarak }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    rsList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
