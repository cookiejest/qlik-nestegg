<template>

<alertform>
    <div class="box">
                  <h4 class="title is-4">
        Test Case Form
      </h4>


<div class="field">
  <div class="control"><label class="label">App</label>
    <div class="select">
      <select>
        <option>Select App</option>
        <option>With options</option>
      </select>
    </div>
  </div>
</div>

<div class="box">
                  <h4 class="title is-5">
        Dimension Conditions
      </h4>

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

                <b-table-column field="dimension_name" label="Dimension">
                    {{ props.row.dimension_name }}
                </b-table-column>

                <b-table-column field="dimension_values" label="Dimension Values">
                    {{ props.row.dimension_values }}
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
<div class="field">
  <div class="control">  <label class="label">Field Name</label>
    <div class="select">
      <select>
        <option>Select Dimension Field</option>
        <option>With options</option>
      </select>
    </div>
  </div>
</div>

<div class="field">
  <div class="control">  <label class="label">Dimension Value</label>
    <div class="select">
      <select>
        <option>Select VaLUE</option>
        <option>With options</option>
      </select>
    </div>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-link">Add Dimension Condition</button>
  </div>
  <div class="control">
    <button class="button is-text">Cancel</button>
  </div>
</div>
</div>

<div class="box">
                  <h4 class="title is-5">
        Measure Limits
      </h4>
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

                <b-table-column field="dimension_name" label="Measure Expression">
                    {{ props.row.dimension_name }}
                </b-table-column>

                <b-table-column field="dimension_values" label="Min Value">
                    {{ props.row.dimension_values }}
                </b-table-column>
                <b-table-column field="dimension_values" label="Max Value">
                    {{ props.row.dimension_values }}
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
<div class="field">
  <label class="label">Measure Expression</label>
  <div class="control">
    <input class="input" type="text" placeholder="Text input">
  </div>
</div>

<div class="field">
  <label class="label">Minimum Value</label>
  <div class="control">
    <input class="input" type="text" placeholder="Text input">
  </div>
</div>

<div class="field">
  <label class="label">Maximum Value</label>
  <div class="control">
    <input class="input" type="text" placeholder="Text input">
  </div>
</div>








<div class="field is-grouped">
  <div class="control">
    <button class="button is-link">Add Measure Limit</button>
  </div>
  <div class="control">
    <button class="button is-text">Cancel</button>
  </div>
</div>

</div>


<div class="field is-grouped">
  <div class="control">
    <button class="button is-link">Add Test Case</button>
  </div>
  <div class="control">
    <button class="button is-text">Cancel</button>
  </div>
</div>
</div>

</alertform>
          </template>

          <script>
export default {
  name: 'TestCaseFormComponent',
  data () {

    const data = [
      {
        dimension_name: "dim1",
        dimension_values: "sum(Sales)"
      },
      {
        dimension_name: "dim1",
        dimension_values: "sum(Sales)"
      }
    ];


        return {
            data,
                selectedOptions: []
        }
  }
}
</script>