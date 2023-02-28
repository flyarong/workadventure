import type { AreaData, AreaDataProperties } from "../types";
import { AreaType } from "../types";
import * as _ from "lodash";
import { MathUtils } from "@workadventure/math-utils";
import type { GameMap } from "./GameMap";
import { ITiledMapObject, ITiledMapProperty } from "@workadventure/tiled-map-type-guard";

export type AreaChangeCallback = (
    areasChangedByAction: Array<AreaData>,
    allAreasOnNewPosition: Array<AreaData>
) => void;

export class GameMapAreas {
    private gameMap: GameMap;

    private enterAreaCallbacks = Array<AreaChangeCallback>();
    private leaveAreaCallbacks = Array<AreaChangeCallback>();

    /**
     * Areas created from within map-editor
     */
    private readonly staticAreas: AreaData[] = [];
    /**
     * Areas that we can do CRUD operations on via scripting API
     */
    private readonly dynamicAreas: AreaData[] = [];

    private readonly areasPositionOffsetY: number = 16;
    private readonly staticAreaNamePrefix = "STATIC_AREA_";
    private unnamedStaticAreasCounter = 0;

    constructor(gameMap: GameMap) {
        this.gameMap = gameMap;
    }

    public mapAreaToTiledObject(areaData: AreaData): Omit<ITiledMapObject, "id"> & { id?: string | number } {
        return {
            id: areaData.id,
            type: "area",
            class: "area",
            name: areaData.name,
            visible: true,
            x: areaData.x,
            y: areaData.y,
            width: areaData.width,
            height: areaData.height,
            properties: this.mapAreaPropertiesToTiledProperties(areaData.properties),
        };
    }

    private mapAreaPropertiesToTiledProperties(areaProperties: AreaDataProperties): ITiledMapProperty[] {
        const properties: ITiledMapProperty[] = [];

        // TODO: ADD THE REST IN A SAME WAY OR PREFERABLY FIGURE SOMETHING MORE CLEVER OUT
        if (areaProperties.jitsiRoom) {
            properties.push({ name: "jitsiRoom", type: "string", value: areaProperties.jitsiRoom.roomName ?? "" });
        }

        return properties;
    }

    /**
     * @returns If there were any areas changes
     */
    public triggerAreasChange(
        oldPosition: { x: number; y: number } | undefined,
        position: { x: number; y: number } | undefined
    ): boolean {
        const areasByOldPosition = oldPosition ? this.getAreasOnPosition(oldPosition, this.areasPositionOffsetY) : [];
        const areasByNewPosition = position ? this.getAreasOnPosition(position, this.areasPositionOffsetY) : [];

        const enterAreas = new Set(areasByNewPosition);
        const leaveAreas = new Set(areasByOldPosition);

        enterAreas.forEach((area) => {
            if (leaveAreas.has(area)) {
                leaveAreas.delete(area);
                enterAreas.delete(area);
            }
        });

        let areasChange = false;
        if (enterAreas.size > 0) {
            const areasArray = Array.from(enterAreas);

            for (const callback of this.enterAreaCallbacks) {
                callback(areasArray, areasByNewPosition);
            }
            areasChange = true;
        }

        if (leaveAreas.size > 0) {
            const areasArray = Array.from(leaveAreas);
            for (const callback of this.leaveAreaCallbacks) {
                callback(areasArray, areasByNewPosition);
            }
            areasChange = true;
        }
        return areasChange;
    }

    public addArea(area: AreaData, type: AreaType, playerPosition?: { x: number; y: number }): boolean {
        if (this.getAreas(type).find((existingArea) => existingArea.id === area.id)) {
            return false;
        }
        this.getAreas(type).push(area);
        // const floorLayer = this.gameMap.getMap().layers.find((layer) => layer.name === "floorLayer");
        // if (floorLayer) {
        // const areaDataAsTileObject = this.mapAreaDataToTiledObject(area);
        // this.gameMap.incrementNextObjectId();
        // (floorLayer as ITiledMapObjectLayer).objects.push(areaDataAsTileObject);
        // as we are making changes to the map itself, we can update tiledObjects helper array too!
        // this.gameMap.tiledObjects.push(areaDataAsTileObject);
        // }

        if (playerPosition && this.isPlayerInsideAreaByName(area.name, type, playerPosition)) {
            this.triggerSpecificAreaOnEnter(area);
        }
        return true;
    }

    public isPlayerInsideArea(id: string, type: AreaType, playerPosition: { x: number; y: number }): boolean {
        return (
            this.getAreasOnPosition(playerPosition, this.areasPositionOffsetY, type).findIndex(
                (area) => area.id === id
            ) !== -1
        );
    }

    public isPlayerInsideAreaByName(name: string, type: AreaType, position: { x: number; y: number }): boolean {
        return (
            this.getAreasOnPosition(position, this.areasPositionOffsetY, type).findIndex(
                (area) => area.name === name
            ) !== -1
        );
    }
    public updateAreaByName(name: string, type: AreaType, config: Partial<AreaData>): AreaData | undefined {
        const area = this.getAreaByName(name, type);
        if (!area) {
            return;
        }
        this.updateArea(area, config);
        return area;
    }

    public updateAreaById(id: string, type: AreaType, config: Partial<AreaData>): AreaData | undefined {
        const area = this.getArea(id, type);
        if (!area) {
            return;
        }
        this.updateArea(area, config);
        return area;
    }

    public deleteAreaByName(name: string, type: AreaType, playerPosition?: { x: number; y: number }): void {
        if (playerPosition) {
            const area = this.getAreasOnPosition(playerPosition, this.areasPositionOffsetY, type).find(
                (area) => area.name === name
            );
            if (area) {
                this.triggerSpecificAreaOnLeave(area);
            }
        }
        const areas = this.getAreas(type);
        const index = areas.findIndex((area) => area.name === name);
        if (index !== -1) {
            areas.splice(index, 1);
            // const areaId = areas.find((area) => area.name === name)?.id;
            // if (areaId) {
            //     this.deleteStaticArea(areaId);
            // }
        }
    }

    public deleteAreaById(id: string, type: AreaType, playerPosition?: { x: number; y: number }): boolean {
        if (playerPosition) {
            const area = this.getAreasOnPosition(playerPosition, this.areasPositionOffsetY, type).find(
                (area) => area.id === id
            );
            if (area) {
                this.triggerSpecificAreaOnLeave(area);
            }
        }
        const areas = this.getAreas(type);
        const index = areas.findIndex((area) => area.id === id);
        if (index !== -1) {
            areas.splice(index, 1);
            return true;
            // success = this.deleteStaticArea(id);
        }
        return false;
    }

    private updateArea(area: AreaData, config: Partial<AreaData>): void {
        // const tiledObject = this.gameMap.tiledObjects.find((object) => object.id === area.id);
        // if (!tiledObject) {
        //     throw new Error(`Area of id: ${area.id} has not been mapped to tileObjects array!`);
        // }
        if (config.properties) {
            _.merge(area, config);
        }
        // _.merge(tiledObject, this.mapAreaDataToTiledObject(area));
    }

    // private deleteStaticArea(id: string): boolean {
    //     // TODO: TiledObjects is not up to date! They are a reference because only first level of flatLayers objects are deep copied!
    //     const index = this.gameMap.tiledObjects.findIndex((object) => object.id === id);
    //     if (index !== -1) {
    //         this.gameMap.tiledObjects.splice(index, 1);
    //         return this.gameMap.deleteGameObjectFromMapById(id, this.gameMap.getMap().layers);
    //     }
    //     return false;
    // }

    public getAreas(areaType: AreaType): AreaData[] {
        return areaType === AreaType.Dynamic ? this.dynamicAreas : this.staticAreas;
    }

    public getAreaByName(name: string, type: AreaType): AreaData | undefined {
        return this.getAreas(type).find((area) => area.name === name);
    }

    public getArea(id: string, type: AreaType): AreaData | undefined {
        return this.getAreas(type).find((area) => area.id === id);
    }

    /**
     * Registers a callback called when the user moves inside another area.
     */
    public onEnterArea(callback: AreaChangeCallback) {
        this.enterAreaCallbacks.push(callback);
    }

    /**
     * Registers a callback called when the user moves outside another area.
     */
    public onLeaveArea(callback: AreaChangeCallback) {
        this.leaveAreaCallbacks.push(callback);
    }

    public triggerSpecificAreaOnEnter(area: AreaData): void {
        for (const callback of this.enterAreaCallbacks) {
            callback([area], []);
        }
    }

    public triggerSpecificAreaOnLeave(area: AreaData): void {
        for (const callback of this.leaveAreaCallbacks) {
            callback([area], []);
        }
    }

    public getProperties(position: { x: number; y: number }): Map<string, string | boolean | number> {
        return new Map();
        // const properties = new Map<string, string | boolean | number>();
        // for (const area of this.getAreasOnPosition(position, this.areasPositionOffsetY)) {
        //     if (area.properties === undefined) {
        //         continue;
        //     }
        //     const flattenedProperties = this.flattenAreaProperties(area.properties);
        //     for (const key in flattenedProperties) {
        //         const property = flattenedProperties[key];
        //         if (property === undefined) {
        //             continue;
        //         }
        //         properties.set(key, property);
        //     }
        // }
        // return properties;
    }

    public setProperty(area: AreaData, key: string, value: string | number | boolean | undefined): void {
        // switch (key) {
        //     case "focusable": {
        //         if (typeof value === "boolean" || value === undefined) {
        //             area.properties.focusable = value;
        //         }
        //         break;
        //     }
        //     case "zoomMargin": {
        //         if (typeof value === "number" || value === undefined) {
        //             area.properties.zoomMargin = value;
        //         }
        //         break;
        //     }
        //     case "silent": {
        //         if (typeof value === "boolean" || value === undefined) {
        //             area.properties.silent = value;
        //         }
        //         break;
        //     }
        //     default: {
        //         area.properties.customProperties[key] = value;
        //     }
        // }
    }

    // private flattenAreaProperties(properties: AreaProperties): Record<string, string | boolean | number> {
    //     const flattenedProperties: Record<string, string | boolean | number> = {};
    //     if (properties.focusable !== undefined) {
    //         flattenedProperties.focusable = properties.focusable;
    //     }
    //     if (properties.zoomMargin !== undefined) {
    //         flattenedProperties.zoomMargin = properties.zoomMargin;
    //     }
    //     if (properties.silent !== undefined) {
    //         flattenedProperties.silent = properties.silent;
    //     }

    //     for (const key in properties.customProperties) {
    //         //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         flattenedProperties[key] = properties.customProperties[key];
    //     }
    //     return flattenedProperties;
    // }

    private getAreasOnPosition(position: { x: number; y: number }, offsetY = 0, areaType?: AreaType): AreaData[] {
        const areasOfInterest = areaType
            ? this.getAreas(areaType).values()
            : [...this.staticAreas.values(), ...this.dynamicAreas.values()];

        const overlappedAreas: AreaData[] = [];
        for (const area of areasOfInterest) {
            if (MathUtils.isOverlappingWithRectangle({ x: position.x, y: position.y + offsetY }, area)) {
                overlappedAreas.push(area);
            }
        }
        return overlappedAreas;
    }
}
