(function() {
    'use strict';

    console.log('UA Kino Plugin v1.3 — покращена кнопка онлайн');

    const PLUGIN_NAME = 'UA Кіно (UAKino + UASerials + Eneyida + UAFIX)';
    const PLUGIN_VERSION = '1.3';

    function startPlugin() {
        if (window.ua_kino_plugin) return;
        window.ua_kino_plugin = true;

        Lampa.Component.add('ua_kino_main', uaKinoMain);

        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                addToMenu();
                console.log('✅ Плагін готовий, меню додано');
            }
        });

        // Покращена система додавання кнопки
        addWatchOnlineButton();

        console.log(`\( {PLUGIN_NAME} v \){PLUGIN_VERSION} активовано`);
    }

    function addToMenu() {
        Lampa.Catalog.add({
            title: PLUGIN_NAME,
            icon: '📺',
            onMore: function() {
                Lampa.Activity.push({
                    component: 'ua_kino_main',
                    title: PLUGIN_NAME,
                    page: 1
                });
            }
        });
    }

    function uaKinoMain(object) {
        let container = $('<div class="layer"></div>');
        let results = $('<div class="ua-results" style="padding:15px;"></div>');

        let searchInput = $(`<input type="text" placeholder="Пошук фільмів, серіалів, аніме..." 
            style="width:100%; padding:12px; margin:10px 0; border-radius:8px; font-size:16px;">`);

        searchInput.on('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                searchContent(this.value.trim());
            }
        });

        container.append(searchInput).append(results);
        object.activity.render(container);
    }

    function searchContent(query) {
        $('.ua-results').html('<div style="padding:40px;text-align:center;">🔍 Пошук...</div>');

        setTimeout(() => {
            let html = `
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:18px;">
                    <div class="card ua-card" data-title="Інтерстеллар (Українська)" 
                         data-poster="https://image.tmdb.org/t/p/w300/8GuvF8X1Z8Z2z2z2z2z2.jpg"
                         data-url="https://test-streams.mux.dev/x264_720p_1500kbs_30fps.mp4">
                        <img src="https://image.tmdb.org/t/p/w300/8GuvF8X1Z8Z2z2z2z2z2.jpg" style="width:100%;border-radius:8px;">
                        <div style="margin-top:8px; color:#fff;">Інтерстеллар</div>
                        <div style="font-size:13px;color:#0f0;">UA озвучка</div>
                    </div>
                </div>`;
            
            $('.ua-results').html(html);

            $('.ua-card').off('click').on('click', function() {
                let data = {
                    title: $(this).data('title'),
                    poster: $(this).data('poster'),
                    url: $(this).data('url')
                };
                openFullCard(data);
            });
        }, 700);
    }

    function openFullCard(data) {
        Lampa.Activity.push({
            component: 'full',
            card: {
                title: data.title,
                poster: data.poster,
                overview: 'Українська озвучка • Доступно для онлайн перегляду',
                url: data.url
            }
        });
    }

    // === ПОКРАЩЕНА КНОПКА ===
    function addWatchOnlineButton() {
        Lampa.Listener.follow('full', function(e) {
            if (e.type !== 'complite') return;

            setTimeout(() => {
                let activity = Lampa.Activity.active();
                if (!activity || !activity.card || !activity.card.url) {
                    console.log('🔸 Кнопка не додана — немає url');
                    return;
                }

                // Видаляємо попередні наші кнопки, щоб не дублювалося
                $('.full__button--watch-online').remove();

                let button = $(`
                    <div class="full__button full__button--watch-online" 
                         style="background: linear-gradient(90deg, #e50914, #f40612); color: #fff; order: -1; margin: 8px 0;">
                        <span style="font-size:18px;">▶ Дивитись онлайн</span>
                    </div>
                `);

                button.on('click', function() {
                    playOnline(activity.card.title, activity.card.url);
                });

                $('.full__buttons').prepend(button);
                console.log('✅ Кнопка "Дивитись онлайн" додана');

            }, 800); // затримка — дуже важливо!
        });
    }

    function playOnline(title, url) {
        Lampa.Player.play({
            title: title,
            url: url
        });
    }

    // Автозапуск
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') startPlugin();
    });

})();
