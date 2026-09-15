// Un menu custom KubeJS
ClientEvents.init(event => {
    event.registerOverlay("balrog_menu", overlay => {
        overlay.position(0, 0);
        overlay.size(300, 200);

        overlay.text("Balrog Worlds", 20, 20, 0xFFFFFF);

        overlay.button("Commencer", 20, 60, 120, 20, btn => {
            Client.player.tell("Menu ouvert !");
        });

        overlay.button("Options", 20, 90, 120, 20, btn => {
            Client.player.tell("Options !");
        });

        overlay.button("Quitter", 20, 120, 120, 20, btn => {
            Client.player.tell("Au revoir !");
        });
    });
});


Commands.register("menu", ctx => {
    ctx.player.openOverlay("balrog_menu");
});

