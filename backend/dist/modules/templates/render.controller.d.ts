import { Request, Response } from 'express';
export declare class RenderController {
    private renderService;
    constructor();
    renderDocx(req: Request, res: Response): Promise<void>;
    renderPdf(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=render.controller.d.ts.map