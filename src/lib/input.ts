export class Input {
    private abort = new AbortController();
    keyPressed: Record<string, boolean> = {};

    constructor() {
        this.hookEvents();
    }

    private hookEvents() {
        const capture = ["w", "a", "s", "d", "e", "q", "shift"];

        window.addEventListener(
            "keydown",
            (e) => {
                const key = e.key.toLowerCase();
                if (capture.includes(key)) {
                    e.preventDefault();
                }

                if (e.repeat) return;
                this.keyPressed[key] = true;
            },
            { signal: this.abort.signal }
        );

        window.addEventListener(
            "keyup",
            (e) => {
                const key = e.key.toLowerCase();
                if (capture.includes(key)) {
                    e.preventDefault();
                }

                this.keyPressed[key] = false;
            },
            { signal: this.abort.signal }
        );
    }

    public unhookEvents() {
        this.abort.abort();
    }
}