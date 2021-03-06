import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | album-tile', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('album', {
      title: 'The Bodyguard',
      coverUrl: 'https://cover.url/of-the-album.png',
      songs: [
        {
          title: 'I Will Always Love You',
          duration: 35400
        },
        {
          title: 'Even If My Heart Would Break',
          duration: 124564
        },
      ],
      comments: [
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
      ]
    })
  });

  test('it renders the album title', async function(assert) {
    await render(hbs`<AlbumTile @album={{album}} />`);

    assert.dom(this.element).includesText('The Bodyguard');
  });

  test('it renders the average rating', async function(assert) {
    await render(hbs`<AlbumTile @album={{album}} />`);

    assert.dom(this.element).hasText(/⭐️\s*⭐️\s*⭐️/g);
  });

  test('it renders the album cover', async function(assert) {
    await render(hbs`<AlbumTile @album={{album}} />`);

    assert.dom('img[src="https://cover.url/of-the-album.png"]').exists();
  });

  test('it renders all songs', async function(assert) {
    await render(hbs`<AlbumTile @album={{album}} />`);

    assert.dom('[data-test-song]').exists({ count: 2 });
    assert.dom(this.element).includesText('I Will Always Love You');
    assert.dom(this.element).includesText('00:35');
    assert.dom(this.element).includesText('Even If My Heart Would Break');
    assert.dom(this.element).includesText('20:50');
  });
});
