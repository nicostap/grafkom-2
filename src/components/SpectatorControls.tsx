import { EventManager, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

const FORWARD = 1 << 0;
const LEFT = 1 << 1;
const RIGHT = 1 << 2;
const BACK = 1 << 3;
const UP = 1 << 4;
const DOWN = 1 << 5;
const SPRINT = 1 << 6;
const ROLL_CW = 1 << 7;
const ROLL_CCW = 1 << 8;

const MOVESPEED = 500;
const FRICTION = 0.9;
const LOOKSPEED = 0.00005;
const SPRINTMULT = 7;
const KEYMAPPING = {
    87: "FORWARD", // W
    83: "BACK", // S
    65: "LEFT", // A
    68: "RIGHT", // D
    81: "ROLL_CW", // Q
    69: "ROLL_CCW", // E
    32: "UP", // Spacebar
    67: "DOWN", // C
    16: "SPRINT", // Shift
} as const;

class SpectatorControlsClass {
    lookSpeed: number;
    moveSpeed: number;
    friction: number;
    sprintMultiplier: number;
    keyMapping: Record<string, string>;
    enabled: boolean;
    _mouseState: { x: number; y: number };
    _keyState: { press: number; prevPress: number };
    _moveState: { velocity: THREE.Vector3 };

    constructor(
        public camera: THREE.Camera,
        public gl: THREE.WebGLRenderer,
        {
            lookSpeed = LOOKSPEED,
            moveSpeed = MOVESPEED,
            friction = FRICTION,
            keyMapping = KEYMAPPING,
            sprintMultiplier = SPRINTMULT,
        } = {}
    ) {
        this.camera = camera;
        this.lookSpeed = lookSpeed;
        this.moveSpeed = moveSpeed;
        this.friction = friction;
        this.sprintMultiplier = sprintMultiplier;
        this.keyMapping = Object.assign({}, KEYMAPPING, keyMapping);
        this.enabled = false;
        this._mouseState = { x: 0, y: 0 };
        this._keyState = { press: 0, prevPress: 0 };
        this._moveState = { velocity: new THREE.Vector3(0, 0, 0) };
        this._processMouseMoveEvent = this._processMouseMoveEvent.bind(this);
        this._processKeyEvent = this._processKeyEvent.bind(this);
        this._processClickEvent = this._processClickEvent.bind(this);
        this._processLockChangeEvent = this._processLockChangeEvent.bind(this);
    }
    _processMouseMoveEvent(event: MouseEvent) {
        this._processMouseMove(event.movementX, event.movementY);
    }
    _processMouseMove(x = 0, y = 0) {
        this._mouseState.x += x;
        this._mouseState.y += y;
    }
    _processKeyEvent(event: KeyboardEvent) {
        this._processKey(event.keyCode, event.type === "keydown");
    }
    _processKey(key: number, isPressed: boolean) {
        const { press } = this._keyState;
        let newPress = press;
        switch (this.keyMapping[key]) {
            case "FORWARD":
                isPressed ? (newPress |= FORWARD) : (newPress &= ~FORWARD);
                break;
            case "BACK":
                isPressed ? (newPress |= BACK) : (newPress &= ~BACK);
                break;
            case "LEFT":
                isPressed ? (newPress |= LEFT) : (newPress &= ~LEFT);
                break;
            case "RIGHT":
                isPressed ? (newPress |= RIGHT) : (newPress &= ~RIGHT);
                break;
            case "UP":
                isPressed ? (newPress |= UP) : (newPress &= ~UP);
                break;
            case "DOWN":
                isPressed ? (newPress |= DOWN) : (newPress &= ~DOWN);
                break;
            case "SPRINT":
                isPressed ? (newPress |= SPRINT) : (newPress &= ~SPRINT);
                break;
            case "ROLL_CW":
                isPressed ? (newPress |= ROLL_CW) : (newPress &= ~ROLL_CW);
                break;
            case "ROLL_CCW":
                isPressed ? (newPress |= ROLL_CCW) : (newPress &= ~ROLL_CCW);
                break;
            default:
                break;
        }
        this._keyState.press = newPress;
    }
    _processContextMenuEvent(event: MouseEvent) {
        event.preventDefault();
    }

    _processClickEvent(event: MouseEvent) {
        if (document.pointerLockElement !== this.gl.domElement) {
            // @ts-expect-error incomplete typings
            this.gl.domElement.requestPointerLock({
                unadjustedMovement: true,
            });
        }
    }

    _processLockChangeEvent(event: Event) {
        if (document.pointerLockElement === this.gl.domElement) {
            this.enable();
        } else {
            this.disable();
        }
    }

    setup() {
        this.gl.domElement.addEventListener("click", this._processClickEvent);
        document.addEventListener(
            "pointerlockchange",
            this._processLockChangeEvent
        );
        document.addEventListener("contextmenu", this._processContextMenuEvent);
    }

    enable() {
        document.addEventListener("mousemove", this._processMouseMoveEvent);
        document.addEventListener("keydown", this._processKeyEvent);
        document.addEventListener("keyup", this._processKeyEvent);

        this.enabled = true;
        this.camera.rotation.reorder("YXZ");
    }
    disable() {
        document.removeEventListener("mousemove", this._processMouseMoveEvent);
        document.removeEventListener("keydown", this._processKeyEvent);
        document.removeEventListener("keyup", this._processKeyEvent);

        this.enabled = false;
        this._keyState.press = 0;
        this._keyState.prevPress = 0;
        this._mouseState = { x: 0, y: 0 };
        this.camera.rotation.reorder("XYZ");
    }
    isEnabled() {
        return this.enabled;
    }
    dispose() {
        this.gl.domElement.removeEventListener(
            "click",
            this._processClickEvent
        );
        document.removeEventListener(
            "pointerlockchange",
            this._processLockChangeEvent
        );
        document.removeEventListener(
            "contextmenu",
            this._processContextMenuEvent
        );
        this.disable();
    }
    update(delta = 1) {
        if (!this.enabled) {
            // finish move transition
            if (this._moveState.velocity.length() > 0) {
                this._moveCamera(this._moveState.velocity);
            }
            return;
        }
        // view angles
        const actualLookSpeed = this.lookSpeed; /* * delta */
        const lon = 20 * this._mouseState.x * actualLookSpeed;
        const lat = 20 * this._mouseState.y * actualLookSpeed;

        this.camera.rotation.x = Math.max(
            Math.min(this.camera.rotation.x - lat, Math.PI / 2),
            -Math.PI / 2
        );
        this.camera.rotation.y -= lon;
        this._mouseState = { x: 0, y: 0 };

        // movements
        let actualMoveSpeed = delta * this.moveSpeed;
        const velocity = this._moveState.velocity.clone();
        const { press } = this._keyState;
        if (press & SPRINT) actualMoveSpeed *= this.sprintMultiplier;
        if (press & FORWARD) velocity.z = -actualMoveSpeed;
        if (press & BACK) velocity.z = actualMoveSpeed;
        if (press & LEFT) velocity.x = -actualMoveSpeed;
        if (press & RIGHT) velocity.x = actualMoveSpeed;
        if (press & UP) velocity.y = actualMoveSpeed;
        if (press & DOWN) velocity.y = -actualMoveSpeed;

        if (press & ROLL_CW)
            this.camera.rotation.z += this.lookSpeed * delta * 8000;
        if (press & ROLL_CCW)
            this.camera.rotation.z -= this.lookSpeed * delta * 8000;

        this._moveCamera(velocity);

        this._moveState.velocity = velocity;
        this._keyState.prevPress = press;
    }
    _moveCamera(velocity: THREE.Vector3) {
        velocity.multiplyScalar(this.friction);
        velocity.clampLength(0, this.moveSpeed);
        this.camera.translateZ(velocity.z);
        this.camera.translateX(velocity.x);
        this.camera.translateY(velocity.y);
    }
    mapKey(key: string, action: string) {
        this.keyMapping = Object.assign({}, this.keyMapping, { [key]: action });
    }
}

export function SpectatorControls() {
    const invalidate = useThree((state) => state.invalidate);
    const camera = useThree((state) => state.camera);
    const gl = useThree((state) => state.gl);

    const events = useThree(
        (state) => state.events
    ) as EventManager<HTMLElement>;

    const get = useThree((state) => state.get);
    const set = useThree((state) => state.set);

    const controls = useMemo(
        () => new SpectatorControlsClass(camera, gl),
        [camera, gl]
    );

    useEffect(() => {
        controls.setup();
        controls.enable();
        return () => void controls.dispose();
    }, [controls, invalidate]);

    // useEffect(() => {
    //     const old = get().controls;
    //     set({ controls });
    //     return () => set({ controls: old });
    // }, [controls]);

    useFrame((_, delta) => controls.update(delta));
    return null;
}
