(function() {
    'use strict';

    console.log('UA Kino Plugin v1.4 — агресивна кнопка');

    const PLUGIN_NAME = 'UA Кіно (UAKino + UASerials + Eneyida + UAFIX)';
    const PLUGIN_VERSION = '1.4';

    function startPlugin() {
        if (window.ua_kino_plugin) return;
        window.ua_kino_plugin = true;

        Lampa.Component.add('ua_kino_main', uaKinoMain);

        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                addToMenu();
                console.log('✅ Плагін v1.4 завантажено');
            }
        });

        addWatchOnlineButtonAdvanced();

        console.log(`\( {PLUGIN_NAME} v \){PLUGIN_VERSION} активовано`);
    }

    function addToMenu() {
        Lampa.Catalog.add({
            title: PLUGIN_NAME,
            icon: '📺',
            onMore: () => Lampa.Activity.push({ component: 'ua_kino_main', title: PLUGIN_NAME })
        });
    }

    function uaKinoMain(object) {
        let container = $('<div class="layer"></div>');
        let results = $('<div class="ua-results" style="padding:15px;"></div>');

        let search = $(`<input type="text" placeholder="Пошук..." style="width:100%; padding:14px; margin:10px 0; border-radius:8px;">`);

        search.on('keydown', (e) => {
            if (e.key === "Enter" && search.val().trim()) searchContent(search.val().trim());
        });

        container.append(search).append(results);
        object.activity.render(container);
    }

    function searchContent(query) {
        $('.ua-results').html('<div style="padding:60px;text-align:center;">🔍 Пошук...</div>');

        setTimeout(() => {
            let html = `
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px;">
                    <div class="card ua-card" data-title="Інтерстеллар (Українська)" 
                         data-poster="https://image.tmdb.org/t/p/w300/8GuvF8X1Z8Z2z2z2z2z2.jpg"
                         data-url="https://test-streams.mux.dev/x264_720p_1500kbs_30fps.mp4">
                        <img src="https://image.tmdb.org/t/p/w300/8GuvF8X1Z8Z2z2z2z2z2.jpg" style="width:100%;border-radius:8px;">
                        <div style="margin-top:8px;color:#fff;">Інтерстеллар</div>
                    </div>
                </div>`;

            $('.ua-results').html(html);

            $('.ua-card').on('click', function() {
                Lampa.Activity.push({
                    component: 'full',
                    card: {
                        title: $(this).data('title'),
                        poster: $(this).data('poster'),
                        overview: 'Українська озвучка • Онлайн',
                        url: $(this).data('url')
                    }
                });
            });
        }, 500);
    }

    // === АГРЕСИВНЕ ДОДАВАННЯ КНОПКИ ===
    function addWatchOnlineButtonAdvanced() {
        // Основний Listener
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') tryAddButton();
        });

        // Додатковий спосіб — кожні 2 секунди перевіряємо
        setInterval(() => {
            if (Lampa.Activity.active().name === 'full') tryAddButton();
        }, 2000);
    }

    function tryAddButton() {
        let card = Lampa.Activity.active().card;
        if (!card || !card.url) return;

        // Видаляємо старі кнопки
        $('.full__button--watch-online').remove();

        let btn = $(`
            <div class="full__button full__button--watch-online" 
                 style="background:#e50914;color:#fff;font-weight:bold;order:-1;padding:14px 0;">
                <span>▶ Дивитись онлайн</span>
            </div>
        `);

        btn.on('click', () => {
            Lampa.Player.play({ title: card.title, url: card.url });
        });

        // Спроба додати в різні місця
        if ($('.full__buttons').length) {
            $('.full__buttons').prepend(btn);
        } else if ($('.full-card__buttons').length) {
            $('.full-card__buttons').prepend(btn);
        } else {
            $('.activity__body').prepend(btn);
        }

        console.log('✅ Кнопка додана (агресивний режим)');
    }

    // Автозапуск
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', (e) => { if (e.type === 'ready') startPlugin(); });

})();                if (!activity || !activity.card || !activity.card.url) {
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
