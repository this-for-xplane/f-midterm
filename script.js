const { Engine, Render, Runner, Bodies, Composite, Matter } = window.Matter;

let exploded = false;
const canvas = document.getElementById('physics-canvas');
const elements = document.querySelectorAll('.explodable');

// 스크롤 감지 시 폭발 트리거
window.addEventListener('scroll', () => {
    if (!exploded && window.scrollY > 20) {
        explode();
    }
});

function explode() {
    exploded = true;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = Engine.create();
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

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // 요소를 이미지화하여 물리 객체 생성
        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            {
                render: {
                    sprite: {
                        texture: elementToImage(el),
                    }
                },
                frictionAir: 0.02,
                restitution: 0.6
            }
        );

        // 무작위 방향으로 튕겨내는 힘(Impulse) 적용
        const forceMagnitude = 0.05 * body.mass;
        window.Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * forceMagnitude,
            y: (Math.random() - 0.8) * forceMagnitude // 위쪽으로 더 많이 튀게 설정
        });

        Composite.add(engine.world, body);
        el.style.visibility = 'hidden';
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
}

/**
 * HTML 요소를 SVG 이미지로 변환하여 Canvas에서 텍스처로 사용 가능하게 함
 */
function elementToImage(el) {
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    
    // 스타일을 인라인으로 복사 (폰트 및 색상 유지)
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; font-size: 16px; color: #313131; background: transparent;">
                    ${el.innerHTML}
                </div>
            </foreignObject>
        </svg>
    `;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
