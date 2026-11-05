"""A portrait for screenshots only: many second-level nodes (domains under the dimensions), placeholders below them.

Every name is a life area seen from its dimension, never a single attribute or event, and each domain sits under one
dimension only, so no name repeats on the map. The facts are placeholders that only give the nodes their sizes (number
of facts), lines (chats behind them) and halos (importance, 1 to 4); they cite chats of the checkout's demo portrait,
so the intro still has lines to show.

    python showcase.py <WeClone checkout> <zh.json> <en.json>     writes the Chinese and English portraits
    python showcase.py <WeClone checkout> --serve zh [--port N]   serves one like `weclone-cli server --demo`

Run it with WeClone's Python environment.
"""

import argparse
import json
import random
import sys
import tempfile
from pathlib import Path

DEMOS = {"zh": "tests/tests_data/profile_hierarchy.demo.json", "en": "tests/tests_data/profile_hierarchy.demo.en.json"}

# dim -> [(zh, en)]. A second-level node is a life area that gathers many facts, seen from that dimension, never a
# single event or attribute; areas sharing a word across dimensions are named apart so no label repeats.
DOMAINS = {
    1: [
        ("籍贯与成长", "Hometown and upbringing"),
        ("教育经历", "Education"),
        ("职业身份", "Occupation"),
        ("公开身份", "Public identity"),
        ("家庭成员", "Family"),
        ("婚恋状况", "Relationship status"),
        ("居住城市", "City of residence"),
        ("外貌体征", "Appearance"),
        ("语言背景", "Languages"),
        ("人生阶段", "Life stage"),
    ],
    2: [
        ("交互设计", "Interaction design"),
        ("设计系统", "Design systems"),
        ("用户研究", "User research"),
        ("视觉排版", "Visual and type"),
        ("AI 产品方法", "AI product methods"),
        ("提示词与评测", "Prompts and evals"),
        ("前端开发", "Front-end development"),
        ("数据与脚本", "Data and scripting"),
        ("写作与演讲", "Writing and speaking"),
        ("胶片摄影", "Film photography"),
        ("理财常识", "Money basics"),
    ],
    3: [
        ("产品愿景", "Product vision"),
        ("事业发展", "Building a business"),
        ("经济独立", "Financial independence"),
        ("职业方向", "Career direction"),
        ("创作表达", "Creative expression"),
        ("个人影响力", "Public influence"),
        ("生活节奏", "Pace of life"),
        ("亲密关系", "Love and partnership"),
        ("友情", "Friendship"),
        ("家庭责任", "Family duty"),
        ("城市归属", "Sense of home"),
        ("自我成长", "Personal growth"),
        ("隐私与安全感", "Privacy and safety"),
    ],
    4: [
        ("个人财务", "Personal finances"),
        ("收入来源", "Income sources"),
        ("住房条件", "Housing"),
        ("数码设备", "Devices"),
        ("摄影器材", "Camera gear"),
        ("开发环境", "Dev setup"),
        ("健康状况", "Health"),
        ("时间精力", "Time and energy"),
        ("人脉网络", "Network"),
        ("合作伙伴", "Collaborators"),
        ("用户社群", "User community"),
        ("保险保障", "Insurance"),
        ("交通出行", "Getting around"),
    ],
    5: [
        ("产品研发与发布", "Building and shipping"),
        ("融资计划", "Fundraising"),
        ("投资理财", "Investing"),
        ("定价与营收", "Pricing and revenue"),
        ("学习进修", "Courses and study"),
        ("旅行计划", "Travel plans"),
        ("体能训练", "Fitness training"),
        ("家庭事务", "Family matters"),
        ("社交安排", "Social plans"),
        ("公开分享", "Talks and podcasts"),
        ("职业规划", "Career plans"),
        ("健康管理", "Health care"),
        ("宠物照护", "Pet care"),
    ],
    8: [
        ("审美风格", "Aesthetic taste"),
        ("加密货币", "Crypto"),
        ("饮食口味", "Food"),
        ("咖啡茶饮", "Coffee and tea"),
        ("影视", "Film and TV"),
        ("音乐", "Music"),
        ("阅读", "Books"),
        ("播客", "Podcasts"),
        ("游戏动漫", "Games and anime"),
        ("旅行方式", "Travel style"),
        ("运动爱好", "Sports"),
        ("社交偏好", "Socializing"),
        ("沟通方式", "Communication style"),
        ("工具软件", "Apps and tools"),
        ("消费习惯", "Spending habits"),
    ],
}
for lang in (0, 1):
    names = [pair[lang] for pairs in DOMAINS.values() for pair in pairs]
    assert len(names) == len(set(names)), "a domain name repeats"


def portraits(checkout: Path) -> dict[str, dict]:
    """The Chinese and English portraits, with the chats and dimension names of the checkout's demo."""
    from weclone.data.agent.llm_profile_hierarchy import dimension_view

    rng = random.Random(7)
    data = {lang: json.loads((checkout / path).read_text()) for lang, path in DEMOS.items()}
    pool = sorted(data["zh"]["sources"])
    facts, domains = {"zh": [], "en": []}, {"zh": [], "en": []}
    for dim, pairs in DOMAINS.items():
        for zh_name, en_name in pairs:
            # Uneven sizes, as in a real profile: most domains small, a few large.
            count = max(3, min(40, round(rng.lognormvariate(2.2, 0.55))))
            importance = rng.uniform(1.8, 3.7)
            indices = list(range(len(facts["zh"]), len(facts["zh"]) + count))
            for n in range(count):
                ids = sorted(rng.sample(pool, rng.choice((1, 1, 2, 2, 3, 4))))
                base = {
                    "dim": dim,
                    "source_ids": ids,
                    "sensitivity": rng.choice(("public", "normal", "normal", "private")),
                    "time_scope": rng.choice(("current", "current", "current", "superseded", "dated", "stable")),
                    "support_count": len(ids),
                    "source_confidence_mean": round(rng.uniform(2.8, 4.0), 2),
                    "source_importance_mean": round(min(4.0, max(1.0, rng.gauss(importance, 0.35))), 2),
                }
                facts["zh"].append(
                    {
                        **base,
                        "domain": zh_name,
                        "attr": f"{zh_name}要点{n + 1}",
                        "value": "截图用占位事实。",
                        "topic": zh_name,
                    }
                )
                facts["en"].append(
                    {
                        **base,
                        "domain": en_name,
                        "attr": f"{en_name} point {n + 1}",
                        "value": "Placeholder fact for screenshots.",
                        "topic": en_name,
                    }
                )
            for lang, name in (("zh", zh_name), ("en", en_name)):
                domains[lang].append(
                    {"name": name, "description": name, "topics": [{"name": name, "fact_indices": indices}]}
                )

    result = {}
    for lang, demo in data.items():
        names = {dim["dim"]: dim["name"] for dim in demo["dimensions"]}
        dimensions = [{**dim, "name": names[dim["dim"]]} for dim in dimension_view(facts[lang], domains[lang])]
        used = sorted({sid for fact in facts[lang] for sid in fact["source_ids"]})
        meta = {
            "synthetic": True,
            "purpose": "截图专用：只演示到板块，板块以下的事实是占位。"
            if lang == "zh"
            else "Screenshots only: the map down to domains; everything below them is a placeholder.",
            **{key: demo["_demo"][key] for key in ("snapshot_date", "persona", "message_total", "messages_by_month")},
            "expected_facts": len(facts[lang]),
        }
        result[lang] = {
            "_demo": meta,
            "domains": domains[lang],
            "dimensions": dimensions,
            "facts": facts[lang],
            "sources": {sid: demo["sources"][sid] for sid in used},
        }
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("checkout", type=Path)
    parser.add_argument("outputs", type=Path, nargs="*", metavar="zh.json en.json")
    parser.add_argument("--serve", choices=("zh", "en"))
    parser.add_argument("--port", type=int, default=5175)
    args = parser.parse_args()
    if bool(args.serve) == bool(args.outputs) or (args.outputs and len(args.outputs) != 2):
        parser.error("give either the two output files or --serve")
    checkout = args.checkout.resolve()
    sys.path.insert(0, str(checkout))
    made = portraits(checkout)
    if args.outputs:
        for lang, path in zip(("zh", "en"), args.outputs):
            path.write_text(json.dumps(made[lang], ensure_ascii=False, indent=1) + "\n")
        return
    import weclone.server.app as app

    with tempfile.TemporaryDirectory() as folder:
        path = Path(folder) / "showcase.json"
        path.write_text(json.dumps(made[args.serve], ensure_ascii=False))
        app.DEMO_DATA = Path(folder)
        app.DEMO_PROFILES = {args.serve: path.name}
        app.serve(port=args.port, demo=args.serve)


if __name__ == "__main__":
    main()
