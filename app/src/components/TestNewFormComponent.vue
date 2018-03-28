<template>
    <section>
        <button class="button is-primary is-medium"
            @click="isComponentModalActive = true">
            Create Test
        </button>

        <b-modal :active.sync="isComponentModalActive" has-modal-card>
            <modal-form v-bind="formProps"></modal-form>
        </b-modal>
    </section>
</template>

<script>
    const ModalForm = {
        props: ['test_name'],
        template: `
            <form action="">
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Create Test</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Test Name">
                            <b-input
                                type="text"
                                :value="test_name"
                                placeholder="New Test Name"
                                required>
                            </b-input>
                        </b-field>

                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" type="button" @click="$parent.close()">Close</button>
                        <button class="button is-primary">Create</button>
                    </footer>
                </div>
            </form>
        `
    }

    export default {
        components: {
            ModalForm
        },
        data() {
            return {
                isComponentModalActive: false,
                formProps: {
                    test_name: 'my first test'
                }
            }
        }
    }
</script>