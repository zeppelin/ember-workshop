import { module, skip, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerEvent, triggerKeyEvent, click } from '@ember/test-helpers';
import Pretender from 'pretender';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | new-comment', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender(function() {
      this.post('/api/comments', () => {
        return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
          data: {
            id: '3',
            type: 'comment',
            attributes: {
              rating: 5,
              text: 'I love this!',
              'created-at': new Date()
            },
            relationships: {
              album: {
                data: { type: 'album', id: '1' }
              }
            }
          }
        })];
      });
    });
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders a comment form', async function(assert) {
    await render(hbs`<NewComment />`);

    assert.dom('form').exists();
    assert.dom('[data-test-new-comment-rating-input]').exists();
    assert.dom('[data-test-new-comment-text-input]').exists();
    assert.dom('[data-test-new-comment-submit]').exists();
  });

  skip('it disables the submit button when nothing has been entered', async function(assert) {
    await render(hbs`<NewComment />`);

    assert.dom('[data-test-new-comment-submit]').isDisabled();
  });

  test('it enables the submit button when nothing has been entered', async function(assert) {
    await render(hbs`<NewComment />`);
    await fillIn('[data-test-new-comment-rating-input]', 3);
    await fillIn('[data-test-new-comment-text-input]', 'yeah, ok…');
    await triggerKeyEvent('[data-test-new-comment-text-input]', 'keyup', '…');

    assert.dom('[data-test-new-comment-submit]').isNotDisabled();
  });

  test('it resets fields once the comment has been saved', async function(assert) {
    await render(hbs`<NewComment />`);
    await fillIn('[data-test-new-comment-rating-input]', 3);
    await fillIn('[data-test-new-comment-text-input]', 'yeah, ok…');
    await triggerKeyEvent('[data-test-new-comment-text-input]', 'keyup', '…');
    await click('[data-test-new-comment-submit]');

    assert.dom('[data-test-new-comment-rating-input]').hasValue('');
    assert.dom('[data-test-new-comment-text-input]').hasValue('');
  });

  test('validations disappear after filling in the fields', async function(assert) {
    await render(hbs`<NewComment />`);
    await click('[data-test-new-comment-submit]');

    assert.dom('[data-test-error-field="rating"]').hasText('You must add a rating.');
    assert.dom('[data-test-error-field="text"]').hasText('You must add a comment.');

    await fillIn('[data-test-new-comment-rating-input]', 5);
    assert.dom('[data-test-error-field="rating"]').doesNotExist();
    await fillIn('[data-test-new-comment-rating-input]', 0);
    assert.dom('[data-test-error-field="rating"]').hasText('You must add a rating.');

    await fillIn('[data-test-new-comment-text-input]', 'I love this!');
    assert.dom('[data-test-error-field="text"]').doesNotExist();
    await fillIn('[data-test-new-comment-text-input]', '');
    assert.dom('[data-test-error-field="text"]').hasText('You must add a comment.');
  });

  test('validations apper after performing blur on empty fields', async function(assert) {
    await render(hbs`<NewComment />`);

    assert.dom('[data-test-error-field="rating"]').doesNotExist();
    assert.dom('[data-test-error-field="text"]').doesNotExist();

    await triggerEvent('[data-test-new-comment-rating-input]', 'focus');
    await triggerEvent('[data-test-new-comment-rating-input]', 'blur');

    assert.dom('[data-test-error-field="rating"]').hasText('You must add a rating.');

    await triggerEvent('[data-test-new-comment-text-input]', 'focus');
    await triggerEvent('[data-test-new-comment-text-input]', 'blur');

    assert.dom('[data-test-error-field="text"]').hasText('You must add a comment.');
  });
});
