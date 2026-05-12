<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)


## Rideio core feature:

so, the logic is like this:

It's a ride sharing app. The rider can create ride post. A driver can accept a ride post. The driver must be subscribed to our system by paying 700 bdt per month to accept rides. 

a user or rider both can see all the other ride posts with only name, any sensitive information like where's he going or phone number etc are hidden even if he is logged in. When a user tries to create his own post for a travel journey, he must log in with necessary info. a rider can see people's posts with only limited info, but when he tries to accept a ride, he mush log in/ subscribe. 

The rider can select info when creating ride post like from - to, when should the driver arrive. no time limit for posts, the posts stays until a driver accepts. it stays even after the ride accepted by driver, but with a tag ride accepted. A rider can cancel the ride if he's not interested. But cancellation must happen before the ride started. All the ride history should be preserved for both driver and rider. Driver may have the total earning, his overall review etc on his dashboard. Rider sees his travel history in dashboard. An admin can see all the thing a rider and driver can. While creating a ride post, rider can use maps to select places. Not providing any live location support during ride now. I'll use sslcommerz for payment integration. It's bangladesh based. 

I've given you a high level overview from a user perspective.



Maintain standard folder structure. Maintain maintainability. Don't write a big chunk of code. write modular, component based code, DRY principles. Use tailwind css for styling. Use typescript. Use shadcn ui.


