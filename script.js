const { Engine, Render, Runner, Bodies, Composite, Body, Events } = Matter;

let exploded = false;
const canvas = document.getElementById('physics-canvas');
const elements = document.querySelectorAll('.explodable');

window.addEventListener('scroll', () => {
    if (!exploded && window.scrollY > 15) {
        startMadness();
    }
});

function startMadness() {
    exploded = true;
    document.body.classList.add('madness');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = Engine.create();
    engine.gravity.y = 0; // 중력 제거 (둥둥 떠다님)

    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    // 화면 경계 벽 생성 (통통 튕기게 함)
    const wallOptions = { isStatic: true, restitution: 1, friction: 0 };
    Composite.add(engine.world, [
        Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, wallOptions), // 천장
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, wallOptions), // 바닥
        Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, wallOptions), // 왼쪽 벽
        Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, wallOptions) // 오른쪽 벽
    ]);

    elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        
        // 무지개 효과 추가
        el.classList.add('rainbow');

        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                restitution: 1.05, // 부딪힐 때마다 에너지가 5%씩 증가 (점점 빨라짐)
                friction: 0,
                frictionAir: 0,
                render: {
                    sprite: {
                        texture: elementToImage(el),
                    }
                }
            }
        );

        // 초기 무작위 발사
        const speed = 10;
        const angle = Math.random() * Math.PI * 2;
        Body.setVelocity(body, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });

        // 회전 추가
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.5);

        Composite.add(engine.world, body);
        el.style.visibility = 'hidden';
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // 색상이 계속 변하는 효과를 위한 루프
    Events.on(engine, 'afterUpdate', () => {
        // 시간이 지날수록 점점 미쳐가는 속도 제한 (너무 빠르면 화면 뚫고 나감)
        engine.world.bodies.forEach(body => {
            if (body.speed > 25) {
                Body.setVelocity(body, { 
                    x: body.velocity.x * 0.99, 
                    y: body.velocity.y * 0.99 
                });
            }
        });
    });
}

function elementToImage(el) {
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    
    // 무지개 네온 효과를 이미지에 입힘
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; font-weight: bold; color: #fff; text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000; padding: 5px;">
                    ${el.innerHTML}
                </div>
            </foreignObject>
        </svg>
    `;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
