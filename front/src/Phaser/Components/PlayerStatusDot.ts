import { AvailabilityStatus } from "../../Messages/ts-proto-generated/protos/messages";
import { Easing } from "../../types";

export class PlayerStatusDot extends Phaser.GameObjects.Container {
    private statusImage: Phaser.GameObjects.Image;
    private statusImageOutline: Phaser.GameObjects.Image;

    private status: AvailabilityStatus;

    private readonly COLORS: Record<AvailabilityStatus, { filling: number; outline: number }> = {
        [AvailabilityStatus.AWAY]: { filling: 0xf5931e, outline: 0x875d13 },
        [AvailabilityStatus.ONLINE]: { filling: 0x8cc43f, outline: 0x427a25 },
        [AvailabilityStatus.SILENT]: { filling: 0xe74c3c, outline: 0xc0392b },
        [AvailabilityStatus.JITSI]: { filling: 0x8cc43f, outline: 0x427a25 },
        [AvailabilityStatus.UNRECOGNIZED]: { filling: 0xffffff, outline: 0xffffff },
        [AvailabilityStatus.UNCHANGED]: { filling: 0xffffff, outline: 0xffffff },
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.status = AvailabilityStatus.ONLINE;

        this.statusImage = this.scene.add.image(0, 0, "iconStatusIndicatorInside");
        this.statusImageOutline = this.scene.add.image(0, 0, "iconStatusIndicatorOutline");

        this.add([this.statusImage, this.statusImageOutline]);

        this.redraw();

        this.scene.add.existing(this);
    }

    public setStatus(status: AvailabilityStatus, instant: boolean = false): void {
        if (this.status === status || status === AvailabilityStatus.UNCHANGED) {
            return;
        }
        this.status = status;
        if (instant) {
            this.redraw();
        } else {
            this.playStatusChangeAnimation();
        }
    }

    private playStatusChangeAnimation(): void {
        this.scale = 1;
        this.scene.tweens.add({
            targets: [this],
            duration: 200,
            yoyo: true,
            ease: Easing.BackEaseIn,
            scale: 0,
            onYoyo: () => {
                this.redraw();
            },
            onComplete: () => {
                this.scale = 1;
            },
        });
    }

    private redraw(): void {
        const colors = this.COLORS[this.status];
        this.statusImage.setTintFill(colors.filling);
        this.statusImageOutline.setTintFill(colors.outline);
    }
}
