#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
void main(){
 vec2 uv=gl_FragCoord.xy/u_resolution.xy;
 uv.x*=u_resolution.x/u_resolution.y;
 float g=2.;
 vec2 gv=uv*g,st=fract(gv)*2.-1.;
 float t=u_time*.6;
 st+=.05*vec2(sin(5.*st.y+t),cos(5.*st.x+t));
 float r=length(st),a=mod(atan(st.y,st.x)+t*.3,6.2831/6.)-3.14159/6.;
 float m=smoothstep(0.,.02,sin(r*40.-t*4.)*sin(a*12.+r*12.));
 gl_FragColor=vec4(vec3(1,0,0)*m,1.);
}
