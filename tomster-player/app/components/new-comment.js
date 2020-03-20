import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Validations, { presence, nonZero } from '../utils/validations';

export default Component.extend({
  store: inject(),

  init() {
    this._super(...arguments);
    this.set('rating', 0);

    this.set('validations', new Validations(this, {
      rating: {
        validate: nonZero,
        errorMessage: 'You must add a rating.'
      },
      text: {
        validate: presence,
        errorMessage: 'You must add a comment.'
      }
    }));
  },

  submitDisabled: computed('rating', 'text', function() {
    return !this.rating || !this.text;
  }),

  ratingOptions: computed('rating', function() {
    return [
      { value: 1, label: '⭐️' },
      { value: 2, label: '⭐️⭐️' },
      { value: 3, label: '⭐️⭐️⭐️' },
      { value: 4, label: '⭐️⭐️⭐️⭐️' },
      { value: 5, label: '⭐️⭐️⭐️⭐️⭐️' }
    ].map((option) => {
      return {
        ...option,
        selected: option.value === this.rating
      };
    })
  }),

  actions: {
    ratingChanged(event) {
      this.set('rating', Number(event.target.value));
      this.validations.validate(['rating']);
    },

    textChanged(event) {
      this.set('text', event.target.value);
      this.validations.validate(['text']);
    },

    async createComment(event) {
      event.preventDefault();

      if (!this.validations.validate()) {
        return;
      }

      let comment = this.store.createRecord('comment', {
        album: this.album,
        text: this.text,
        rating: this.rating
      });
      await comment.save();
      this.setProperties({ rating: null, text: null });
    }
  }
});
