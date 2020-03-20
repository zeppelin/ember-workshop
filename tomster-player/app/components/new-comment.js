import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { isBlank } from '@ember/utils';

export default Component.extend({
  store: inject(),

  init() {
    this._super(...arguments);
    this.set('errors', {});
    this.set('rating', 0);

    this.set('validations', {
      rating: {
        validate: () => {
          let rating = this.get('rating');
          let isValid = rating !== 0;
          this.set(`errors.rating`, !isValid);
          return isValid;
        }
      },
      text: {
        validate: () => {
        let isValid = !isBlank(this.get('text'));
        this.set(`errors.text`, !isValid);
        return isValid;
      }
    }});
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
      this.get('validations.rating').validate();
    },

    textChanged(event) {
      this.set('text', event.target.value);
      this.get('validations.text').validate();
    },

    async createComment(event) {
      event.preventDefault();

      let isValid = ['rating', 'text'].reduce((acc, attrName) => {
        let isValidAttr = this.get(`validations.${attrName}`).validate(attrName);

        if (acc === false) {
          return;
        }

        return isValidAttr;
      }, true);

      if (!isValid) {
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
