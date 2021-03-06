import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | comments-list', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('comments', [
      {
        rating: 1,
        text: 'Not actually my favorite…',
        'created-at': new Date(2016, 0, 10, 12, 34)
      },
      {
        rating: 5,
        text: 'Such a great album - a total christmas classic for me!',
        'created-at': new Date(2015, 11, 24, 18, 5)
      }
    ]);
  });

  test('it renders all comments', async function(assert) {
    await render(hbs`<CommentsList @comments={{comments}} />`);

    assert.dom('[data-test-comment]').exists({ count: 2 });
    assert.dom(this.element).includesText('Not actually my favorite…');
    assert.dom(this.element).includesText('Such a great album - a total christmas classic for me!');
  });
});
