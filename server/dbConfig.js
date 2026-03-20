"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgConfig = void 0;
const bookmark_entity_1 = require("./src/entities/bookmark.entity");
exports.pgConfig = {
    type: 'postgres',
    url: 'postgresql://neondb_owner:npg_5Es2cLBZlnAp@ep-empty-brook-an5i74k2-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    port: 5432,
    entities: [bookmark_entity_1.Bookmarks],
    synchronize: true,
    ssl: {
        rejectUnauthorized: false,
    },
};
//# sourceMappingURL=dbConfig.js.map