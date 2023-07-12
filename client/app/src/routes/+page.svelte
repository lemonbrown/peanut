<script lang="ts">
    import { getPocketBaseImageUrl}  from "$lib/utils/imageUrlHelper"
    export let data: any;

</script>
<style>
    .hover-bg-grey:hover{
        background-color: rgb(236, 236, 236);
    }

    .hover-color-red:hover{
        background-color: rgb(238, 178, 178);
        color:red;
    }

    .hover-color-blue:hover{
        background-color: rgb(154, 182, 235);
        color:blue;
    }
</style>

<div class="container mt-3">
    {#each data.chapters as chapter}
            <div class="row" role="button">
                <div class="col-3 text-end">
                    <img 
                        class="rounded-circle" 
                        width="60" height="60"
                        alt=""
                        src="{getPocketBaseImageUrl("mangas", chapter.expand.mangaId.id ,chapter.expand.mangaId.avatar) }" />
                </div>
                
                <div class="col-9">
                    <span><span class="fw-bold">{chapter.expand.mangaId.title}</span></span>
                    <br/>
                    Chapter {chapter.number} - 
                    {chapter.name}
                </div>
            </div>
    {/each}
</div>
