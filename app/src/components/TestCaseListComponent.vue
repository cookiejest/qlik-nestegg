<template>
    <section>
              <h4 class="title is-4">
        Test Case List
      </h4>
        <b-field grouped group-multiline>
            <div class="control">
                <b-switch v-model="isBordered">Bordered</b-switch>
            </div>
        </b-field>
{{this.$store.state.activeTest}}
        <b-table
            :data="isEmpty ? [] : data"
            :bordered="isBordered"
            :striped="isStriped"
            :narrowed="isNarrowed"
            :hoverable="isHoverable"
            :loading="isLoading"
            :focusable="isFocusable"
            :mobile-cards="hasMobileCards">

            <template slot-scope="props">
                <b-table-column field="id" label="ID" width="30" numeric>
                    {{ props.row.id }}
                </b-table-column>

                <b-table-column field="app_name" label="App Name">
                    {{ props.row.app_name }}
                </b-table-column>

                <b-table-column field="dimension_conditions" label="Dimension Conditions">
                      <li v-for="dimension_condition in props.row.dimension_conditions">
    {{ dimension_condition.dimension_name }} =     {{ dimension_condition.dimension_value }}
  </li>

                </b-table-column>


                <b-table-column field="measure_conditions" label="Measure Conditions">
                      <li v-for="measure_condition in props.row.measure_conditions">
    {{ measure_condition.measure_name }} =     {{ measure_condition.measure_value }}
  </li>

                </b-table-column>

                <b-table-column field="status" label="Status" centered>
                    <span 
                    v-bind:class="[props.row.status === 'pass' ? 'tag is-success' : 'tag is-danger']">
                        {{ props.row.status }}
                    </span>
                </b-table-column>

                <b-table-column label="Actions">
<a class="delete"></a>
                    <!--<b-icon pack="fas" :icon="props.row.gender === 'Male' ? 'user' : 'venus'">
                    </b-icon>
                    {{ props.row.gender }}-->
                </b-table-column>
            </template>

            <template slot="empty">
                <section class="section">
                    <div class="content has-text-grey has-text-centered">
                        <p>
                            <b-icon
                                icon="emoticon-sad"
                                size="is-large">
                            </b-icon>
                        </p>
                        <p>Nothing here.</p>
                    </div>
                </section>
            </template>
        </b-table>
    </section>
</template>

<script>
export default {
  data() {
    const data = [
      {
        id: 1,
        app_name: "some app1",
        dimension_conditions: [
          { dimension_name: "dim1", dimension_value: "someval" },
          { dimension_name: "dim2", dimension_value: "someval" }
        ],
        measure_conditions: [
          { measure_name: "measure1", measure_value: "someval1" },
          { measure_name: "measure2", measure_value: "someval2" }
        ],
        status: "pass"
      },
      {
        id: 1,
        app_name: "some app1",
        dimension_conditions: "Simmons",
        measure: "sum(Sales)",
        min_val: 20,
        max_val: 21,
        status: "fail"
      }
    ];

    return {
      data,
      isEmpty: false,
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true
    };
  }
};
</script>