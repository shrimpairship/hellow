/**
 * NestJS 项目上下文提取脚本 — 第1层: 确定性提取
 *
 * 用法: node extract-project-context.js <项目路径> <输出目录>
 *
 * 功能:
 * 1. 解析 package.json 获取依赖信息
 * 2. 扫描 src/ 目录发现 Module/Controller/Service/Provider
 * 3. 解析 @Module/@Controller/@Injectable 等装饰器
 * 4. 生成 project-context.json 和 route-graph.json
 * 5. 复制源码到 _snapshot/sources/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.argv[2];
const outDir = process.argv[3];

if (!projectRoot || !outDir) {
    console.error('用法: node extract-project-context.js <项目路径> <输出目录>');
    process.exit(1);
}

// ============================================================
// 工具函数
// ============================================================
function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch { return null; }
}

function walkDir(dir, ext) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
            results.push(...walkDir(fullPath, ext));
        } else if (entry.isFile() && entry.name.endsWith(ext)) {
            results.push(fullPath);
        }
    }
    return results;
}

// ============================================================
// 第1步: 解析 package.json
// ============================================================
const pkgPath = path.join(projectRoot, 'package.json');
const pkg = readJson(pkgPath);
if (!pkg) {
    console.error('错误: 未找到 package.json');
    process.exit(1);
}

const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const nestVersion = deps['@nestjs/core'] || 'unknown';
const tsVersion = deps['typescript'] || 'unknown';

console.log(`[提取] NestJS: ${nestVersion}, TypeScript: ${tsVersion}`);

// ============================================================
// 第2步: 扫描 TypeScript 源文件
// ============================================================
const srcDir = path.join(projectRoot, 'src');
const tsFiles = walkDir(srcDir, '.ts');
const sourceFiles = [];

for (const file of tsFiles) {
    const relative = path.relative(projectRoot, file);
    sourceFiles.push({
        absolute_path: file,
        relative_path: relative.replace(/\\/g, '/'),
        size: fs.statSync(file).size,
    });
}

console.log(`[提取] 发现 ${sourceFiles.length} 个 TypeScript 文件`);

// ============================================================
// 第3步: 提取装饰器信息 (文本级粗提取)
// ============================================================
const MODULE_RE = /@Module\s*\(\s*\{/g;
const CONTROLLER_RE = /@Controller\s*\((?:'([^']*)'|"([^"]*)")?/g;
const INJECTABLE_RE = /@Injectable\(\)/g;
const ROUTE_RE = /@(Get|Post|Put|Patch|Delete|All)\s*\((?:'([^']*)'|"([^"]*)")?/g;
const GUARD_RE = /@UseGuards\s*\(([^)]+)\)/g;
const IMPORT_RE = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;

const modules = [];
const controllers = [];
const services = [];
const routes = [];
const guards = [];

for (const file of sourceFiles) {
    const content = fs.readFileSync(file.absolute_path, 'utf-8');
    const relative = file.relative_path;

    // 检测 @Module
    if (MODULE_RE.test(content)) {
        const imports = [];
        let m;
        while ((m = IMPORT_RE.exec(content)) !== null) {
            imports.push({ names: m[1].trim(), from: m[2] });
        }
        modules.push({ file: relative, imports });
    }

    // 检测 @Controller
    CONTROLLER_RE.lastIndex = 0;
    let cMatch;
    while ((cMatch = CONTROLLER_RE.exec(content)) !== null) {
        const prefix = cMatch[1] || cMatch[2] || '/';
        controllers.push({ file: relative, prefix });
    }

    // 检测 @Injectable
    if (INJECTABLE_RE.test(content)) {
        // 尝试找到 class 名
        const classMatch = content.match(/export\s+class\s+(\w+)/);
        services.push({
            file: relative,
            name: classMatch ? classMatch[1] : 'unknown',
        });
    }

    // 检测路由
    ROUTE_RE.lastIndex = 0;
    let rMatch;
    while ((rMatch = ROUTE_RE.exec(content)) !== null) {
        const method = rMatch[1];
        const routePath = rMatch[2] || '/';
        routes.push({
            file: relative,
            method,
            path: routePath,
            line: content.substring(0, rMatch.index).split('\n').length,
        });
    }

    // 检测守卫
    GUARD_RE.lastIndex = 0;
    let gMatch;
    while ((gMatch = GUARD_RE.exec(content)) !== null) {
        guards.push({
            file: relative,
            guard: gMatch[1].trim(),
            line: content.substring(0, gMatch.index).split('\n').length,
        });
    }
}

// ============================================================
// 第4步: 输出上下文文件
// ============================================================
const contextDir = path.join(outDir, '_context');
const snapshotDir = path.join(outDir, '_snapshot', 'sources');
ensureDir(contextDir);
ensureDir(snapshotDir);

const context = {
    project: {
        name: pkg.name || path.basename(projectRoot),
        version: pkg.version || '0.0.0',
        description: pkg.description || '',
    },
    technologies: {
        nestjs: nestVersion,
        typescript: tsVersion,
        orm: deps['@nestjs/typeorm'] ? 'TypeORM' :
             deps['@prisma/client'] ? 'Prisma' :
             deps['@mikro-orm/core'] ? 'MikroORM' :
             deps['@nestjs/mongoose'] ? 'Mongoose' : 'unknown',
        database: deps['pg'] ? 'PostgreSQL' :
                  deps['mysql2'] ? 'MySQL' :
                  deps['sqlite3'] ? 'SQLite' :
                  deps['mongodb'] ? 'MongoDB' : 'unknown',
        auth: deps['@nestjs/passport'] ? 'Passport' :
              deps['@nestjs/jwt'] ? 'JWT' : 'none',
    },
    stats: {
        total_files: sourceFiles.length,
        modules: modules.length,
        controllers: controllers.length,
        services: services.length,
        routes: routes.length,
    },
    modules,
    controllers,
    services,
    routes,
    guards,
    generated_at: new Date().toISOString(),
};

fs.writeFileSync(
    path.join(contextDir, 'project-context.json'),
    JSON.stringify(context, null, 2),
    'utf-8'
);

// 路由图
const routeGraph = {
    routes: routes.map(r => {
        const ctrl = controllers.find(c => c.file === r.file);
        return {
            ...r,
            full_path: ctrl ? `${ctrl.prefix}${r.path}` : r.path,
        };
    }),
};
fs.writeFileSync(
    path.join(contextDir, 'route-graph.json'),
    JSON.stringify(routeGraph, null, 2),
    'utf-8'
);

// ============================================================
// 第5步: 复制源码快照
// ============================================================
let copiedCount = 0;
for (const file of sourceFiles) {
    const relPath = file.relative_path.replace('src/', '');
    const target = path.join(snapshotDir, relPath);
    ensureDir(path.dirname(target));
    try {
        fs.copyFileSync(file.absolute_path, target);
        copiedCount++;
    } catch (e) {
        console.warn(`[警告] 复制失败: ${file.relative_path}`);
    }
}

console.log(`[提取] 完成! 复制了 ${copiedCount} 个源文件`);
console.log(`[提取] 上下文: ${path.join(contextDir, 'project-context.json')}`);
console.log(`[提取] 路由图: ${path.join(contextDir, 'route-graph.json')}`);
console.log(`[提取] 快照: ${snapshotDir}`);
