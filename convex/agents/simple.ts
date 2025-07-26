import {google} from '@ai-sdk/google'
import { Agent } from '@convex-dev/agent';
import { components } from '../_generated/api';


export const agent = new Agent(components.agent, {
  name: "My Agent",
  chat: google.chat("gemini-2.0-flash"),
});